/**
 * Author: Professor Krasso
 * Date: 8/14/24
 * File: index.js
 * Description: Apre agent performance API for the agent performance reports
 */

'use strict';

const express = require('express');
const { mongo } = require('../../../utils/mongo');
const createError = require('http-errors');

const router = express.Router();

/**
 * @description
 *
 * GET /call-duration-by-date-range
 *
 * Fetches call duration data for agents within a specified date range.
 *
 * Example:
 * fetch('/call-duration-by-date-range?startDate=2023-01-01&endDate=2023-01-31')
 *  .then(response => response.json())
 *  .then(data => console.log(data));
 */
router.get('/call-duration-by-date-range', (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return next(createError(400, 'Start date and end date are required'));
    }

    console.log('Fetching call duration report for date range:', startDate, endDate);

    mongo(async db => {
      const data = await db.collection('agentPerformance').aggregate([
        {
          $match: {
            date: {
              $gte: new Date(startDate),
              $lte: new Date(endDate)
            }
          }
        },
        {
          $lookup: {
            from: 'agents',
            localField: 'agentId',
            foreignField: 'agentId',
            as: 'agentDetails'
          }
        },
        {
          $unwind: '$agentDetails'
        },
        {
          $group: {
            _id: '$agentDetails.name',
            totalCallDuration: { $sum: '$callDuration' }
          }
        },
        {
          $project: {
            _id: 0,
            agent: '$_id',
            callDuration: '$totalCallDuration'
          }
        },
        {
          $group: {
            _id: null,
            agents: { $push: '$agent' },
            callDurations: { $push: '$callDuration' }
          }
        },
        {
          $project: {
            _id: 0,
            agents: 1,
            callDurations: 1
          }
        }
      ]).toArray();

      res.send(data);
    }, next);
  } catch (err) {
    console.error('Error in /call-duration-by-date-range', err);
    next(err);
  }
});

/**
 * @description
 *
 * GET /agent-performance-by-month
 *
 * Fetches agent performance data (call duration and call count) for a specified month.
 *
 * Example:
 * fetch('/agent-performance-by-month?month=1')
 *  .then(response => response.json())
 *  .then(data => console.log(data));
 */
router.get('/agent-performance-by-month', (req, res, next) => {
  try {
    // Extract the month query parameter from the request
    const { month } = req.query;

    // Return 400 if no month is provided
    if (!month) {
      return next(createError(400, 'month is required'));
    }

    // Convert month to a number for use in the aggregation pipeline
    const monthNumber = Number(month);

    // Validate that month is a number in the range 1–12
    if (isNaN(monthNumber) || monthNumber < 1 || monthNumber > 12) {
      return next(createError(400, 'month must be a number between 1 and 12'));
    }

    console.log('Fetching agent performance report for month:', monthNumber);

    mongo(async db => {
      const data = await db.collection('agentPerformance').aggregate([
        {
          // Ensure the date field is cast to a Date type for month extraction
          $addFields: {
            date: { $toDate: '$date' }
          }
        },
        {
          // Keep only records whose date falls in the requested month
          $match: {
            $expr: { $eq: [{ $month: '$date' }, monthNumber] }
          }
        },
        {
          // Join with the agents collection to resolve agentId → agent name
          $lookup: {
            from: 'agents',
            localField: 'agentId',
            foreignField: 'agentId',
            as: 'agentDetails'
          }
        },
        {
          // Flatten the agentDetails array produced by $lookup
          $unwind: '$agentDetails'
        },
        {
          // Group by agent name and accumulate total call duration and call count
          $group: {
            _id: '$agentDetails.name',
            totalCallDuration: { $sum: '$callDuration' },
            totalCalls: { $sum: 1 }
          }
        },
        {
          // Rename _id to agent and suppress the internal _id field
          $project: {
            _id: 0,
            agent: '$_id',
            totalCallDuration: 1,
            totalCalls: 1
          }
        },
        {
          // Return results in alphabetical order by agent name
          $sort: { agent: 1 }
        }
      ]).toArray();

      res.send(data);
    }, next);
  } catch (err) {
    console.error('Error in /agent-performance-by-month', err);
    next(err);
  }
});

module.exports = router;