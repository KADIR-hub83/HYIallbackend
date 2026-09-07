const { MasterData } = require('../models/masterDataModel');

const ALLOWED_TYPES = new Set([
  'designation',
  'university',
  'degree',
  'language',
  'skill',
]);

const escapeRegex = (value = '') => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

const getMasterData = async (req, res, type) => {
  try {
    if (!ALLOWED_TYPES.has(type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid master data type',
      });
    }

    const search = String(req.query.q || '')
      .trim()
      .toLowerCase();

    const requestedLimit = Number(req.query.limit);

    const limit =
      Number.isFinite(requestedLimit) &&
      requestedLimit > 0
        ? Math.min(requestedLimit, 100)
        : 30;

    const filter = {
      type,
      isActive: true,
    };

    if (search) {
      filter.normalizedName = {
        $regex: escapeRegex(search),
        $options: 'i',
      };
    }

    const records = await MasterData.find(filter)
      .sort({
        sortOrder: 1,
        name: 1,
      })
      .limit(limit)
      .select('_id name metadata')
      .lean();

    return res.status(200).json({
      success: true,

      data: records.map(item => ({
        _id: item._id,
        name: item.name,
        metadata: item.metadata || {},
      })),

      count: records.length,
    });
  } catch (error) {
    console.error(
      `GET ${type.toUpperCase()} ERROR:`,
      error,
    );

    return res.status(500).json({
      success: false,
      message: `Failed to fetch ${type} data`,
      error:
        process.env.NODE_ENV === 'development'
          ? error.message
          : undefined,
    });
  }
};

const getDesignations = async (req, res) => {
  return getMasterData(
    req,
    res,
    'designation',
  );
};

const getUniversities = async (req, res) => {
  return getMasterData(
    req,
    res,
    'university',
  );
};

const getDegrees = async (req, res) => {
  return getMasterData(
    req,
    res,
    'degree',
  );
};

const getLanguages = async (req, res) => {
  return getMasterData(
    req,
    res,
    'language',
  );
};

const getSkills = async (req, res) => {
  return getMasterData(
    req,
    res,
    'skill',
  );
};

module.exports = {
  getDesignations,
  getUniversities,
  getDegrees,
  getLanguages,
  getSkills,
};