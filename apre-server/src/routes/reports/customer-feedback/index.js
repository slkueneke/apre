/**
 * Author: Professor Krasso
 * Date: 8/14/24
 * File: index.js
 * Description: Apre customer feedback API for the customer feedback reports
 */

'use strict';

const express = require('express');
const { mongo } = require('../../../utils/mongo');
const createError = require('http-errors');

const router = express.Router();

/**
 * @description
 *
 * GET /channel-rating-by-month
 *
 * Fetches average customer feedback ratings by channel for a specified month.
 *
 * Example:
 * fetch('/channel-rating-by-month?month=1')
 *  .then(response => response.json())
 *  .then(data => console.log(data));
 */
router.get('/channel-rating-by-month', (req, res, next) => {
  try {
    const { month } = req.query;

    if (!month) {
      return next(createError(400, 'month and channel are required'));
    }

    mongo (async db => {
      const data = await db.collection('customerFeedback').aggregate([
        {
          $addFields: {
            date: { $toDate: '$date' }
          }
        },
        {
          $group: {
            _id: {
              channel: "$channel",
              month: { $month: "$date" },
            },
            ratingAvg: { $avg: '$rating'}
          }
        },
        {
          $match: {
            '_id.month': Number(month)
          }
        },
        {
          $group: {
            _id: '$_id.channel',
            ratingAvg: { $push: '$ratingAvg' }
          }
        },
        {
          $project: {
            _id: 0,
            channel: '$_id',
            ratingAvg: 1
          }
        },
        {
          $group: {
            _id: null,
            channels: { $push: '$channel' },
            ratingAvg: { $push: '$ratingAvg' }
          }
        },
        {
          $project: {
            _id: 0,
            channels: 1,
            ratingAvg: 1
          }
        }
      ]).toArray();

      res.send(data);
    }, next);

  } catch (err) {
    console.error('Error in /rating-by-date-range-and-channel', err);
    next(err);
  }
});

/**
 * @description
 *
 * GET /rating-by-product
 *
 * Fetches the average customer feedback rating for each product across all records.
 * No query parameters are required; the endpoint returns data for every product.
 *
 * Part of Major Task M-108 for new Customer Feedback by Product report (component FeedbackByProductComponent: Create an API to fetch customer feedback data by product and build an Angular component to display customer feedback by product using ChartComponent or TableComponent with 3 unit tests each.)
 *
 */
router.get('/rating-by-product', (req, res, next) => {
  try {
    // Delegate database work to the mongo utility, which manages the connection lifecycle
    mongo(async db => {
      // Aggregate the customerFeedback collection to compute the mean rating per product
      const data = await db.collection('customerFeedback').aggregate([
        {
          // Group every document by its product field and compute the average rating
          $group: {
            _id: '$product',
            ratingAvg: { $avg: '$rating' }
          }
        },
        {
          // Rename _id to product and suppress the internal _id field for a clean response
          $project: {
            _id: 0,
            product: '$_id',
            ratingAvg: 1
          }
        },
        {
          // Sort alphabetically by product name so the chart renders in a predictable order
          $sort: { product: 1 }
        }
      ]).toArray();

      // Send the aggregated product ratings array back to the client
      res.send(data);
    }, next);
  } catch (err) {
    // Log unexpected errors and forward them to the global error handler
    console.error('Error in /rating-by-product', err);
    next(err);
  }
});

module.exports = router;