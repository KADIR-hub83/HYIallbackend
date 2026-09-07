jest.mock('mongoose', () => ({
  connection: {
    db: null,
  },
}));

const mongoose = require('mongoose');
const express = require('express');
const request = require('supertest');
const websiteRoutes = require('../routes/websiteRoutes');
const {
  getAllRolePages,
  getFeaturedJobseekers,
  getFeaturedBlogs,
} = require('../controller/websiteController');

const createResponse = () => ({
  status: jest.fn(function status() {
    return this;
  }),
  json: jest.fn(function json() {
    return this;
  }),
});

const createCursor = (documents) => ({
  sort: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  toArray: jest.fn().mockResolvedValue(documents),
});

describe('websiteController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('getAllRolePages returns an array for the Header component', async () => {
    const rolePages = [{ slug: 'developer', navT: 'Developers' }];
    const collection = {
      find: jest.fn(() => createCursor(rolePages)),
    };
    mongoose.connection.db = {
      collection: jest.fn(() => collection),
    };
    const response = createResponse();

    await getAllRolePages({ query: {} }, response);

    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith(rolePages);
  });

  test('getFeaturedJobseekers returns data in the website contract', async () => {
    const jobseekers = [{ fullName: 'Test Talent' }];
    const collection = {
      find: jest.fn(() => createCursor(jobseekers)),
    };
    mongoose.connection.db = {
      collection: jest.fn(() => collection),
    };
    const response = createResponse();

    await getFeaturedJobseekers({ query: {} }, response);

    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith({ data: jobseekers });
  });

  test('getFeaturedBlogs returns data in the website contract', async () => {
    const blogs = [{ title: 'Test Blog' }];
    const collection = {
      find: jest.fn(() => createCursor(blogs)),
    };
    mongoose.connection.db = {
      collection: jest.fn(() => collection),
    };
    const response = createResponse();

    await getFeaturedBlogs({ query: {} }, response);

    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith({ data: blogs });
  });

  test('returns a JSON 500 response when the database is unavailable', async () => {
    mongoose.connection.db = null;
    const response = createResponse();

    await getAllRolePages({ query: {} }, response);

    expect(response.status).toHaveBeenCalledWith(500);
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Unable to fetch role pages' }),
    );
  });

  test('registers all three public website endpoint paths', async () => {
    const documentsByCollection = {
      rolepages: [{ slug: 'developer', navT: 'Developers' }],
      jobseekers: [{ fullName: 'Test Talent' }],
      blogs: [{ title: 'Test Blog' }],
    };

    mongoose.connection.db = {
      collection: jest.fn((collectionName) => ({
        find: jest.fn(() =>
          createCursor(documentsByCollection[collectionName] || []),
        ),
      })),
    };

    const app = express();
    app.use('/api', websiteRoutes);

    await request(app)
      .get('/api/get-all-role-pages')
      .expect(200)
      .expect([{ slug: 'developer', navT: 'Developers' }]);
    await request(app)
      .get('/api/jobseekers/featured')
      .expect(200)
      .expect({ data: [{ fullName: 'Test Talent' }] });
    await request(app)
      .get('/api/fetured-blogs')
      .expect(200)
      .expect({ data: [{ title: 'Test Blog' }] });
  });
});
