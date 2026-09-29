const mongoose = require("mongoose");

/**
 * MongoDB collection.
 *
 * Agar actual collection name different hai:
 *
 * INDUSTRY_TARGETS_COLLECTION=your_collection_name
 *
 * .env me add kar dena.
 */
const getCollection = () => {
  const collectionName =
    process.env.INDUSTRY_TARGETS_COLLECTION ||
    "industrytargets";

  return mongoose.connection.collection(
    collectionName,
  );
};

const normalizeSlug = (value = "") => {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

const getDocumentSlug = (doc = {}) => {
  if (doc.slug) {
    return normalizeSlug(doc.slug);
  }

  if (doc.mainSlug) {
    return normalizeSlug(doc.mainSlug);
  }

  if (doc.industrySlug) {
    return normalizeSlug(doc.industrySlug);
  }

  if (doc.route) {
    return normalizeSlug(doc.route);
  }

  if (doc.url) {
    const parts = String(doc.url)
      .split("/")
      .filter(Boolean);

    return normalizeSlug(
      parts[parts.length - 1],
    );
  }

  if (doc.mainTitle) {
    return normalizeSlug(doc.mainTitle);
  }

  if (doc.title) {
    return normalizeSlug(doc.title);
  }

  if (doc.name) {
    return normalizeSlug(doc.name);
  }

  return "";
};

/**
 * ============================================================
 * GET ALL INDUSTRIES
 * ============================================================
 *
 * GET /api/get-all-industry-targets
 */
const getAllIndustryTargets = async (
  req,
  res,
) => {
  try {
    const collection = getCollection();

    const documents = await collection
      .find({
        $or: [
          { isActive: true },
          { isActive: { $exists: false } },
          { active: true },
          { active: { $exists: false } },
        ],
      })
      .sort({
        order: 1,
        createdAt: -1,
      })
      .toArray();

    const data = documents.map((item) => ({
      ...item,

      slug: getDocumentSlug(item),

      mainTitle:
        item.mainTitle ||
        item.title ||
        item.name ||
        "",
    }));

    return res.status(200).json({
      success: true,
      data,
      count: data.length,
    });
  } catch (error) {
    console.error(
      "GET ALL INDUSTRY TARGETS ERROR:",
      error,
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch industry targets",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};

/**
 * ============================================================
 * GET INDUSTRY BY SLUG
 * ============================================================
 *
 * GET /api/get-industry-target-by-slug/:slug
 */
const getIndustryTargetBySlug = async (
  req,
  res,
) => {
  try {
    const requestedSlug = normalizeSlug(
      req.params.slug,
    );

    if (!requestedSlug) {
      return res.status(400).json({
        success: false,
        message: "Slug is required",
      });
    }

    const collection = getCollection();

    let document = await collection.findOne({
      $or: [
        { slug: requestedSlug },
        { mainSlug: requestedSlug },
        { industrySlug: requestedSlug },
        { route: requestedSlug },
      ],
    });

    /**
     * Fallback:
     * agar stored slug normalized nahi hai.
     */
    if (!document) {
      const documents = await collection
        .find({})
        .toArray();

      document = documents.find(
        (item) =>
          getDocumentSlug(item) ===
          requestedSlug,
      );
    }

    if (!document) {
      return res.status(404).json({
        success: false,
        message: `Industry not found for slug: ${requestedSlug}`,
      });
    }

    return res.status(200).json({
      success: true,

      data: {
        ...document,
        slug: getDocumentSlug(document),
      },
    });
  } catch (error) {
    console.error(
      "GET INDUSTRY TARGET BY SLUG ERROR:",
      error,
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch industry target",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};

module.exports = {
  getAllIndustryTargets,
  getIndustryTargetBySlug,
};