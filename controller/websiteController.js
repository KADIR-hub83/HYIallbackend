const mongoose = require('mongoose');

const DEFAULT_LIMITS = {
  featuredBlogs: 6,
  featuredJobseekers: 12,
};

const getDatabase = () => {
  if (!mongoose.connection.db) {
    throw new Error('Database connection is not ready');
  }

  return mongoose.connection.db;
};

const getCollection = (environmentKey, fallbackName) => {
  const collectionName = process.env[environmentKey] || fallbackName;
  return getDatabase().collection(collectionName);
};

const getLimit = (value, fallback) => {
  const parsedValue = Number.parseInt(value, 10);

  if (!Number.isFinite(parsedValue) || parsedValue < 1) {
    return fallback;
  }

  return Math.min(parsedValue, 50);
};

// Include documents without a publication flag, but exclude documents that are
// explicitly disabled or saved as drafts.
const publicContentFilter = {
  $and: [
    {
      $or: [
        { isActive: { $exists: false } },
        { isActive: true },
        { isActive: 1 },
      ],
    },
    {
      $or: [{ active: { $exists: false } }, { active: true }, { active: 1 }],
    },
    {
      $or: [
        { status: { $exists: false } },
        { status: { $in: [1, 'active', 'published', 'Published'] } },
      ],
    },
  ],
};

const featuredFilter = {
  $or: [
    { isFeatured: true },
    { isFeatured: 1 },
    { featured: true },
    { featured: 1 },
  ],
};

const getAllRolePages = async (req, res) => {
  try {
    const rolePagesCollection = getCollection(
      'ROLE_PAGES_COLLECTION',
      'rolepages',
    );

    const rolePages = await rolePagesCollection
      .find(publicContentFilter, { projection: { __v: 0 } })
      .sort({ navOrder: 1, order: 1, createdAt: -1 })
      .toArray();

    // The website Header component calls response.map(), so this endpoint must
    // return the array directly rather than wrapping it in a data property.
    return res.status(200).json(rolePages);
  } catch (error) {
    console.error('Unable to fetch role pages:', error);
    return res.status(500).json({
      message: 'Unable to fetch role pages',
      error: error.message,
    });
  }
};

const getFeaturedJobseekers = async (req, res) => {
  try {
    const limit = getLimit(req.query.limit, DEFAULT_LIMITS.featuredJobseekers);
    const jobseekersCollection = getCollection(
      'JOBSEEKERS_COLLECTION',
      'jobseekers',
    );
    const publicProjection = {
      __v: 0,
      email: 0,
      phoneNumber: 0,
      resume: 0,
    };

    let jobseekers = await jobseekersCollection
      .find(
        { $and: [publicContentFilter, featuredFilter] },
        { projection: publicProjection },
      )
      .sort({ featuredOrder: 1, updatedAt: -1, createdAt: -1 })
      .limit(limit)
      .toArray();

    // Older local databases do not have an isFeatured/featured field. In that
    // case, use the newest public profiles so the homepage remains usable.
    if (jobseekers.length === 0) {
      jobseekers = await jobseekersCollection
        .find(publicContentFilter, { projection: publicProjection })
        .sort({ updatedAt: -1, createdAt: -1 })
        .limit(limit)
        .toArray();
    }

    return res.status(200).json({ data: jobseekers });
  } catch (error) {
    console.error('Unable to fetch featured jobseekers:', error);
    return res.status(500).json({
      message: 'Unable to fetch featured jobseekers',
      error: error.message,
    });
  }
};

const getFeaturedBlogs = async (req, res) => {
  try {
    const limit = getLimit(req.query.limit, DEFAULT_LIMITS.featuredBlogs);
    const blogsCollection = getCollection('BLOGS_COLLECTION', 'blogs');

    let blogs = await blogsCollection
      .find(
        { $and: [publicContentFilter, featuredFilter] },
        { projection: { __v: 0 } },
      )
      .sort({ featuredOrder: 1, publishedAt: -1, createdAt: -1 })
      .limit(limit)
      .toArray();

    // Match the website's expected behavior even when older blog documents do
    // not yet contain a featured flag.
    if (blogs.length === 0) {
      blogs = await blogsCollection
        .find(publicContentFilter, { projection: { __v: 0 } })
        .sort({ publishedAt: -1, createdAt: -1 })
        .limit(limit)
        .toArray();
    }

    return res.status(200).json({ data: blogs });
  } catch (error) {
    console.error('Unable to fetch featured blogs:', error);
    return res.status(500).json({
      message: 'Unable to fetch featured blogs',
      error: error.message,
    });
  }
};

module.exports = {
  getAllRolePages,
  getFeaturedJobseekers,
  getFeaturedBlogs,
};
