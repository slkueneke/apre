/**
 * Author: Professor Krasso
 * Date: 10 September 2024
 * File: index.spec.js
 * Description: Test the customer feedback API
 */

// Require the modules
const request = require('supertest');
const app = require('../../../../src/app');
const { mongo } = require('../../../../src/utils/mongo');

jest.mock('../../../../src/utils/mongo');

// Test the customer feedback API
describe('Apre Customer Feedback API', () => {
  beforeEach(() => {
    mongo.mockClear();
  });

  // Test the channel-rating-by-month endpoint
  it("should fetch average customer feedback ratings by channel for a specified month", async () => {
    mongo.mockImplementation(async (callback) => {
      const db = {
        collection: jest.fn().mockReturnThis(),
        aggregate: jest.fn().mockReturnValue({
          toArray: jest.fn().mockResolvedValue([
            {
              channels: ["Email", "Phone"],
              ratingAvg: [4.5, 3.8],
            },
          ]),
        }),
      };
      await callback(db);
    });

    const response = await request(app).get(
      "/api/reports/customer-feedback/channel-rating-by-month?month=1",
    ); // Send a GET request to the channel-rating-by-month endpoint

    // Expect a 200 status code
    expect(response.status).toBe(200);

    // Expect the response body to match the expected data
    expect(response.body).toEqual([
      {
        channels: ["Email", "Phone"],
        ratingAvg: [4.5, 3.8],
      },
    ]);
  });

  // Test the channel-rating-by-month endpoint with missing parameters
  it("should return 400 if the month parameter is missing", async () => {
    const response = await request(app).get(
      "/api/reports/customer-feedback/channel-rating-by-month",
    ); // Send a GET request to the channel-rating-by-month endpoint with missing month
    expect(response.status).toBe(400); // Expect a 400 status code

    // Expect the response body to match the expected data
    expect(response.body).toEqual({
      message: "month and channel are required",
      status: 400,
      type: "error",
    });
  });

  // Test the channel-rating-by-month endpoint with an invalid month
  it("should return 404 for an invalid endpoint", async () => {
    // Send a GET request to an invalid endpoint
    const response = await request(app).get(
      "/api/reports/customer-feedback/invalid-endpoint",
    );
    expect(response.status).toBe(404); // Expect a 404 status code

    // Expect the response body to match the expected data
    expect(response.body).toEqual({
      message: "Not Found",
      status: 404,
      type: "error",
    });
  });

  /**
   * Unit tests for Major Task M-108 (Create an API to fetch customer feedback data by product and build an Angular component to display customer feedback by product using ChartComponent or TableComponent with 3 unit tests each.)
   */
  // Test the rating-by-product endpoint returns average ratings for each product
  it("should fetch average customer feedback ratings by product", async () => {
    // Mock the mongo utility to simulate a successful database aggregation
    mongo.mockImplementation(async (callback) => {
      const db = {
        collection: jest.fn().mockReturnThis(),
        aggregate: jest.fn().mockReturnValue({
          // Simulate the sorted, projected result the aggregation pipeline produces
          toArray: jest.fn().mockResolvedValue([
            { product: "Product A", ratingAvg: 4.1 },
            { product: "Product B", ratingAvg: 3.7 },
          ]),
        }),
      };
      await callback(db);
    });

    // Send a GET request to the rating-by-product endpoint
    const response = await request(app).get(
      "/api/reports/customer-feedback/rating-by-product",
    );

    // Expect a 200 OK status
    expect(response.status).toBe(200);

    // Expect the response body to match the mocked aggregation output
    expect(response.body).toEqual([
      { product: "Product A", ratingAvg: 4.1 },
      { product: "Product B", ratingAvg: 3.7 },
    ]);
  });

  // Test the rating-by-product endpoint returns an empty array when no records exist
  it("should return an empty array when no product feedback data exists", async () => {
    // Mock the mongo utility to simulate a collection with no matching documents
    mongo.mockImplementation(async (callback) => {
      const db = {
        collection: jest.fn().mockReturnThis(),
        aggregate: jest.fn().mockReturnValue({
          // Return an empty array to simulate a database with no customerFeedback documents
          toArray: jest.fn().mockResolvedValue([]),
        }),
      };
      await callback(db);
    });

    // Send a GET request to the rating-by-product endpoint
    const response = await request(app).get(
      "/api/reports/customer-feedback/rating-by-product",
    );

    // Expect a 200 OK status even when there is no data
    expect(response.status).toBe(200);

    // Expect the response body to be an empty array
    expect(response.body).toEqual([]);
  });

  // Test the rating-by-product endpoint returns 500 when the database throws an error
  it("should return 500 when the database throws an error on rating-by-product", async () => {
    // Mock the mongo utility to simulate a database failure
    mongo.mockImplementation(async (callback, next) => {
      // Call the error-forwarding next() with a simulated database error
      next(new Error("Database error"));
    });

    // Send a GET request to the rating-by-product endpoint
    const response = await request(app).get(
      "/api/reports/customer-feedback/rating-by-product",
    );

    // Expect a 500 Internal Server Error status
    expect(response.status).toBe(500);
  });
});