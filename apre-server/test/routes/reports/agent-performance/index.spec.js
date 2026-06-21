/**
 * Author: Professor Krasso
 * Date: 10 September 2024
 * File: index.spec.js
 * Description: Test the agent performance API
 */

// Require the modules
const request = require('supertest');
const app = require('../../../../src/app');
const { mongo } = require('../../../../src/utils/mongo');

jest.mock('../../../../src/utils/mongo');

// Test the agent performance API
describe('Apre Agent Performance API', () => {
  beforeEach(() => {
    mongo.mockClear();
  });

  // Test the call-duration-by-date-range endpoint
  it('should fetch call duration data for agents within a specified date range', async () => {
    mongo.mockImplementation(async (callback) => {
      const db = {
        collection: jest.fn().mockReturnThis(),
        aggregate: jest.fn().mockReturnValue({
          toArray: jest.fn().mockResolvedValue([
            {
              agents: ['Agent A', 'Agent B'],
              callDurations: [120, 90]
            }
          ])
        })
      };
      await callback(db);
    });

    const response = await request(app).get('/api/reports/agent-performance/call-duration-by-date-range?startDate=2023-01-01&endDate=2023-01-31'); // Send a GET request to the call-duration-by-date-range endpoint

    expect(response.status).toBe(200); // Expect a 200 status code

    // Expect the response body to match the expected data
    expect(response.body).toEqual([
      {
        agents: ['Agent A', 'Agent B'],
        callDurations: [120, 90]
      }
    ]);
  });

  // Test the call-duration-by-date-range endpoint with missing parameters
  it('should return 400 if startDate or endDate is missing', async () => {
    const response = await request(app).get('/api/reports/agent-performance/call-duration-by-date-range?startDate=2023-01-01'); // Send a GET request to the call-duration-by-date-range endpoint with missing endDate
    expect(response.status).toBe(400); // Expect a 400 status code

    // Expect the response body to match the expected data
    expect(response.body).toEqual({
      message: 'Start date and end date are required',
      status: 400,
      type: 'error'
    });
  });

  // Test the call-duration-by-date-range endpoint with an invalid date range
  it('should return 404 for an invalid endpoint', async () => {
    const response = await request(app).get('/api/reports/agent-performance/invalid-endpoint'); // Send a GET request to an invalid endpoint
    expect(response.status).toBe(404); // Expect a 404 status code
    // Expect the response body to match the expected data
    expect(response.body).toEqual({
      message: 'Not Found',
      status: 404,
      type: 'error'
    });
  });

  // Test that the endpoint returns aggregated performance data when a valid month is supplied
  it('should fetch agent performance data for a specified month', async () => {
    // Mock mongo to return two agents with their aggregated totals
    mongo.mockImplementation(async (callback) => {
      const db = {
        collection: jest.fn().mockReturnThis(),
        aggregate: jest.fn().mockReturnValue({
          toArray: jest.fn().mockResolvedValue([
            { agent: 'Agent A', totalCallDuration: 300, totalCalls: 5 },
            { agent: 'Agent B', totalCallDuration: 150, totalCalls: 3 }
          ])
        })
      };
      await callback(db);
    });

    // Send a GET request with a valid month query parameter
    const response = await request(app).get('/api/reports/agent-performance/agent-performance-by-month?month=1');

    // Expect a 200 status and the mocked agent performance data in the response body
    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      { agent: 'Agent A', totalCallDuration: 300, totalCalls: 5 },
      { agent: 'Agent B', totalCallDuration: 150, totalCalls: 3 }
    ]);
  });

  // Test that the endpoint returns 400 when the month query parameter is omitted
  it('should return 400 if month is missing', async () => {
    // Send a GET request with no month parameter
    const response = await request(app).get('/api/reports/agent-performance/agent-performance-by-month');

    // Expect a 400 status and a descriptive error message
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: 'month is required',
      status: 400,
      type: 'error'
    });
  });

  // Test that the endpoint returns 400 when month is outside the valid 1–12 range
  it('should return 400 if month is out of range', async () => {
    // Send a GET request with month=13, which is invalid
    const response = await request(app).get('/api/reports/agent-performance/agent-performance-by-month?month=13');

    // Expect a 400 status and a descriptive error message
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: 'month must be a number between 1 and 12',
      status: 400,
      type: 'error'
    });
  });
});