const mongoose = require("mongoose");

/**
 * Default MongoDB collection name.
 *
 * Agar aapke MongoDB me collection ka naam different hai to .env me:
 *
 * CONSULTING_SOLUTIONS_COLLECTION=your_collection_name
 *
 * add kar sakte ho.
 */
const getCollection = () => {
  const collectionName =
    process.env.CONSULTING_SOLUTIONS_COLLECTION || "consultingsolutions";

  return mongoose.connection.collection(collectionName);
};

/**
 * Slug normalize helper
 */
const normalizeSlug = (value = "") => {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

/**
 * Document ke possible slug/title fields se slug nikalne ki koshish.
 */
const getDocumentSlug = (doc = {}) => {
  if (doc.slug) return normalizeSlug(doc.slug);

  if (doc.mainSlug) return normalizeSlug(doc.mainSlug);

  if (doc.route) return normalizeSlug(doc.route);

  if (doc.url) {
    const parts = String(doc.url)
      .split("/")
      .filter(Boolean);

    return normalizeSlug(parts[parts.length - 1]);
  }

  if (doc.mainTitle) {
    return normalizeSlug(doc.mainTitle);
  }

  if (doc.title) {
    return normalizeSlug(doc.title);
  }

  return "";
};

/**
 * ============================================================
 * GET ALL CONSULTING SOLUTIONS
 * ============================================================
 *
 * GET /api/get-all-consulting-solutions
 */
const getAllConsultingSolutions = async (req, res) => {
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

    /**
     * Header/navigation ko usually sirf:
     * mainTitle + slug
     * chahiye.
     *
     * Lekin baaki fields bhi preserve kar rahe hain.
     */
    const data = documents.map((item) => {
      const slug = getDocumentSlug(item);

      return {
        ...item,
        slug,
        mainTitle:
          item.mainTitle ||
          item.title ||
          item.name ||
          "",
      };
    });

    return res.status(200).json({
      success: true,
      data,
      count: data.length,
    });
  } catch (error) {
    console.error(
      "GET ALL CONSULTING SOLUTIONS ERROR:",
      error,
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch consulting solutions",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};

/**
 * ============================================================
 * GET CONSULTING SOLUTION BY SLUG
 * ============================================================
 *
 * GET /api/get-consulting-solution-by-slug/:slug
 */
const getConsultingSolutionBySlug = async (
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

    /**
     * Pehle direct DB lookup.
     *
     * Multiple possible schema field names support kiye hain.
     */
    let document = await collection.findOne({
      $or: [
        { slug: requestedSlug },
        { mainSlug: requestedSlug },
        { route: requestedSlug },
      ],
    });

    /**
     * Agar DB me slug field exact format me stored nahi hai,
     * documents ko read karke normalized comparison karenge.
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
        message: `Consulting solution not found for slug: ${requestedSlug}`,
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
      "GET CONSULTING SOLUTION BY SLUG ERROR:",
      error,
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch consulting solution",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};

module.exports = {
  getAllConsultingSolutions,
  getConsultingSolutionBySlug,
};