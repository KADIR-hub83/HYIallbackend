import mongoose from 'mongoose';

const DEFAULT_LIMITS = {
  featuredBlogs: 6,
  featuredJobseekers: 12,
  latestBlogs: 10,
};

const getDatabase = () => {
  if (!mongoose.connection.db) {
    throw new Error('Database connection is not ready');
  }

  return mongoose.connection.db;
};

const getCollection = (environmentKey, fallbackName) => {
  const collectionName =
    process.env[environmentKey] || fallbackName;

  return getDatabase().collection(collectionName);
};

const getLimit = (value, fallback) => {
  const parsedValue = Number.parseInt(value, 10);

  if (
    !Number.isFinite(parsedValue) ||
    parsedValue < 1
  ) {
    return fallback;
  }

  return Math.min(parsedValue, 50);
};

// Include documents without a publication flag,
// but exclude documents explicitly disabled or drafts.
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
      $or: [
        { active: { $exists: false } },
        { active: true },
        { active: 1 },
      ],
    },
    {
      $or: [
        { status: { $exists: false } },
        {
          status: {
            $in: [
              1,
              'active',
              'published',
              'Published',
            ],
          },
        },
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

// ======================================================
// ROLE PAGES
// ======================================================

export const getAllRolePages = async (req, res) => {
  try {
    const rolePagesCollection = getCollection(
      'ROLE_PAGES_COLLECTION',
      'rolepages',
    );

    const rolePages = await rolePagesCollection
      .find(publicContentFilter, {
        projection: { __v: 0 },
      })
      .sort({
        navOrder: 1,
        order: 1,
        createdAt: -1,
      })
      .toArray();

    return res.status(200).json(rolePages);
  } catch (error) {
    console.error(
      'Unable to fetch role pages:',
      error,
    );

    return res.status(500).json({
      message: 'Unable to fetch role pages',
      error: error.message,
    });
  }
};

// ======================================================
// FEATURED JOBSEEKERS
// ======================================================

export const getFeaturedJobseekers = async (
  req,
  res,
) => {
  try {
    const limit = getLimit(
      req.query.limit,
      DEFAULT_LIMITS.featuredJobseekers,
    );

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
        {
          $and: [
            publicContentFilter,
            featuredFilter,
          ],
        },
        {
          projection: publicProjection,
        },
      )
      .sort({
        featuredOrder: 1,
        updatedAt: -1,
        createdAt: -1,
      })
      .limit(limit)
      .toArray();

    if (jobseekers.length === 0) {
      jobseekers = await jobseekersCollection
        .find(publicContentFilter, {
          projection: publicProjection,
        })
        .sort({
          updatedAt: -1,
          createdAt: -1,
        })
        .limit(limit)
        .toArray();
    }

    return res.status(200).json({
      data: jobseekers,
    });
  } catch (error) {
    console.error(
      'Unable to fetch featured jobseekers:',
      error,
    );

    return res.status(500).json({
      message:
        'Unable to fetch featured jobseekers',
      error: error.message,
    });
  }
};

// ======================================================
// FEATURED BLOGS
// ======================================================

export const getFeaturedBlogs = async (
  req,
  res,
) => {
  try {
    const limit = getLimit(
      req.query.limit,
      DEFAULT_LIMITS.featuredBlogs,
    );

    const blogsCollection = getCollection(
      'BLOGS_COLLECTION',
      'blogs',
    );

    let blogs = await blogsCollection
      .find(
        {
          $and: [
            publicContentFilter,
            featuredFilter,
          ],
        },
        {
          projection: { __v: 0 },
        },
      )
      .sort({
        featuredOrder: 1,
        publishedAt: -1,
        createdAt: -1,
      })
      .limit(limit)
      .toArray();

    // Older DB fallback
    if (blogs.length === 0) {
      blogs = await blogsCollection
        .find(publicContentFilter, {
          projection: { __v: 0 },
        })
        .sort({
          publishedAt: -1,
          createdAt: -1,
        })
        .limit(limit)
        .toArray();
    }

    return res.status(200).json({
      data: blogs,
    });
  } catch (error) {
    console.error(
      'Unable to fetch featured blogs:',
      error,
    );

    return res.status(500).json({
      message: 'Unable to fetch featured blogs',
      error: error.message,
    });
  }
};

// ======================================================
// LATEST / ALL BLOGS
// ======================================================

export const getLatestBlogs = async (
  req,
  res,
) => {
  try {
    const parsedPage = Number.parseInt(
      req.query.page,
      10,
    );

    const page =
      Number.isFinite(parsedPage) &&
      parsedPage > 0
        ? parsedPage
        : 1;

    const limit = getLimit(
      req.query.limit,
      DEFAULT_LIMITS.latestBlogs,
    );

    const skip = (page - 1) * limit;

    const blogsCollection = getCollection(
      'BLOGS_COLLECTION',
      'blogs',
    );

    const total =
      await blogsCollection.countDocuments(
        publicContentFilter,
      );

    const blogs = await blogsCollection
      .find(publicContentFilter, {
        projection: {
          __v: 0,
        },
      })
      .sort({
        publishedAt: -1,
        createdAt: -1,
        updatedAt: -1,
      })
      .skip(skip)
      .limit(limit)
      .toArray();

    const totalPages =
      total > 0
        ? Math.ceil(total / limit)
        : 0;

    return res.status(200).json({
      pagination: {
        data: blogs,
        limit,
        page,
        total,
        totalPages,
      },
    });
  } catch (error) {
    console.error(
      'Unable to fetch latest blogs:',
      error,
    );

    return res.status(500).json({
      message: 'Unable to fetch latest blogs',
      error: error.message,

      pagination: {
        data: [],
        limit: DEFAULT_LIMITS.latestBlogs,
        page: 1,
        total: 0,
        totalPages: 0,
      },
    });
  }
};