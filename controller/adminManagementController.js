const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const {
  UserBase,
} = require('../models/authModel');

const {
  UserType,
} = require('../models/userTypeModel');

const {
  Region,
} = require('../models/regionModel');


// ============================================================
// HELPERS
// ============================================================

const escapeRegex = value =>
  String(value || '')
    .replace(/[.*+?^${}()|[\]\\]/g, '\\$&');


const normalizeEmail = value =>
  String(value || '')
    .trim()
    .toLowerCase();


const normalizeText = value =>
  String(value || '')
    .trim();


const isValidObjectId = id =>
  mongoose.Types.ObjectId.isValid(id);


// ============================================================
// GET ALL USER TYPES
//
// Frontend contract:
// dataManagementApi.getAllRoles()
// expects DIRECT ARRAY:
//
// [
//   { _id: "...", name: "admin" },
//   ...
// ]
// ============================================================

const getUserTypes = async (req, res) => {
  try {
    const userTypes =
      await UserType.find({
        isActive: true,
      })
        .select('_id name')
        .sort({
          name: 1,
        })
        .lean();

    return res.status(200).json(
      userTypes,
    );
  } catch (error) {
    console.error(
      'GET USER TYPES ERROR:',
      error,
    );

    return res.status(500).json({
      success: false,
      message:
        'Failed to fetch user types',
    });
  }
};


// ============================================================
// CREATE USER TYPE
// ============================================================

const createUserType = async (
  req,
  res,
) => {
  try {
    const name = normalizeText(
      req.body?.name,
    ).toLowerCase();

    if (!name) {
      return res.status(400).json({
        success: false,
        message:
          'User type name is required',
      });
    }

    const existing =
      await UserType.findOne({
        name,
      });

    if (existing) {
      return res.status(409).json({
        success: false,
        message:
          'User type already exists',
      });
    }

    const userType =
      await UserType.create({
        name,
        isSystem: false,
        isActive: true,
      });

    return res.status(201).json({
      success: true,
      message:
        'User type created successfully',
      data: userType,
    });
  } catch (error) {
    console.error(
      'CREATE USER TYPE ERROR:',
      error,
    );

    if (error?.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          'User type already exists',
      });
    }

    return res.status(500).json({
      success: false,
      message:
        'Failed to create user type',
    });
  }
};


// ============================================================
// GET USER TYPE BY ID
// ============================================================

const getUserTypeById = async (
  req,
  res,
) => {
  try {
    const { userId } = req.params;

    if (!isValidObjectId(userId)) {
      return res.status(400).json({
        success: false,
        message:
          'Invalid user type ID',
      });
    }

    const userType =
      await UserType.findById(
        userId,
      ).lean();

    if (!userType) {
      return res.status(404).json({
        success: false,
        message:
          'User type not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: userType,
    });
  } catch (error) {
    console.error(
      'GET USER TYPE ERROR:',
      error,
    );

    return res.status(500).json({
      success: false,
      message:
        'Failed to fetch user type',
    });
  }
};


// ============================================================
// UPDATE USER TYPE
// ============================================================

const updateUserType = async (
  req,
  res,
) => {
  try {
    const { userId } = req.params;

    if (!isValidObjectId(userId)) {
      return res.status(400).json({
        success: false,
        message:
          'Invalid user type ID',
      });
    }

    const name = normalizeText(
      req.body?.name,
    ).toLowerCase();

    if (!name) {
      return res.status(400).json({
        success: false,
        message:
          'User type name is required',
      });
    }

    const userType =
      await UserType.findById(
        userId,
      );

    if (!userType) {
      return res.status(404).json({
        success: false,
        message:
          'User type not found',
      });
    }

    if (
      userType.isSystem === true
    ) {
      return res.status(403).json({
        success: false,
        message:
          'System user types cannot be renamed',
      });
    }

    const duplicate =
      await UserType.findOne({
        name,
        _id: {
          $ne: userId,
        },
      });

    if (duplicate) {
      return res.status(409).json({
        success: false,
        message:
          'User type already exists',
      });
    }

    userType.name = name;

    await userType.save();

    return res.status(200).json({
      success: true,
      message:
        'User type updated successfully',
      data: userType,
    });
  } catch (error) {
    console.error(
      'UPDATE USER TYPE ERROR:',
      error,
    );

    return res.status(500).json({
      success: false,
      message:
        'Failed to update user type',
    });
  }
};


// ============================================================
// DELETE USER TYPE
// ============================================================

const deleteUserType = async (
  req,
  res,
) => {
  try {
    const { userId } = req.params;

    if (!isValidObjectId(userId)) {
      return res.status(400).json({
        success: false,
        message:
          'Invalid user type ID',
      });
    }

    const userType =
      await UserType.findById(
        userId,
      );

    if (!userType) {
      return res.status(404).json({
        success: false,
        message:
          'User type not found',
      });
    }

    if (
      userType.isSystem === true
    ) {
      return res.status(403).json({
        success: false,
        message:
          'System user types cannot be deleted',
      });
    }

    const usersUsingRole =
      await UserBase.countDocuments({
        userType:
          userType.name,
      });

    if (usersUsingRole > 0) {
      return res.status(409).json({
        success: false,
        message:
          `Cannot delete role. ${usersUsingRole} user(s) are currently using it.`,
      });
    }

    await UserType.findByIdAndDelete(
      userId,
    );

    return res.status(200).json({
      success: true,
      message:
        'User type deleted successfully',
    });
  } catch (error) {
    console.error(
      'DELETE USER TYPE ERROR:',
      error,
    );

    return res.status(500).json({
      success: false,
      message:
        'Failed to delete user type',
    });
  }
};


// ============================================================
// ADMIN LIST
//
// GET /api/userTypes?page=1
// ============================================================

const getAdmins = async (
  req,
  res,
) => {
  try {
    const page = Math.max(
      Number(req.query.page) || 1,
      1,
    );

    const limit = Math.min(
      Math.max(
        Number(req.query.limit) ||
          10,
        1,
      ),
      100,
    );

    const skip =
      (page - 1) * limit;

    const filter = {};

    if (req.query.hyiId) {
      filter.hyiId = {
        $regex: escapeRegex(
          req.query.hyiId,
        ),
        $options: 'i',
      };
    }

    if (req.query.email) {
      filter.email = {
        $regex: escapeRegex(
          req.query.email,
        ),
        $options: 'i',
      };
    }

    if (req.query.userType) {
      filter.userType =
        req.query.userType;
    }

    if (req.query.name) {
      const nameRegex =
        escapeRegex(
          req.query.name,
        );

      filter.$or = [
        {
          firstName: {
            $regex:
              nameRegex,
            $options: 'i',
          },
        },
        {
          middleName: {
            $regex:
              nameRegex,
            $options: 'i',
          },
        },
        {
          lastName: {
            $regex:
              nameRegex,
            $options: 'i',
          },
        },
      ];
    }

    if (
      req.query.startDate ||
      req.query.endDate
    ) {
      filter.createdAt = {};

      if (req.query.startDate) {
        const startDate =
          new Date(
            req.query.startDate,
          );

        if (
          !Number.isNaN(
            startDate.getTime(),
          )
        ) {
          filter.createdAt.$gte =
            startDate;
        }
      }

      if (req.query.endDate) {
        const endDate =
          new Date(
            req.query.endDate,
          );

        if (
          !Number.isNaN(
            endDate.getTime(),
          )
        ) {
          endDate.setHours(
            23,
            59,
            59,
            999,
          );

          filter.createdAt.$lte =
            endDate;
        }
      }
    }

    const [
      users,
      total,
    ] = await Promise.all([
      UserBase.find(filter)
        .select(
          '-password -otp -otpExpiration -jwtToken',
        )
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(limit)
        .lean(),

      UserBase.countDocuments(
        filter,
      ),
    ]);

    return res.status(200).json({
      success: true,

      data: users,

      pagination: {
        currentPage: page,

        totalPages:
          Math.max(
            Math.ceil(
              total / limit,
            ),
            1,
          ),

        totalItems: total,

        limit,
      },
    });
  } catch (error) {
    console.error(
      'GET ADMINS ERROR:',
      error,
    );

    return res.status(500).json({
      success: false,
      message:
        'Failed to fetch users',
    });
  }
};


// ============================================================
// GET ADMIN BY ID
// ============================================================

const getAdminById = async (
  req,
  res,
) => {
  try {
    const { userId } = req.params;

    if (!isValidObjectId(userId)) {
      return res.status(400).json({
        success: false,
        message:
          'Invalid user ID',
      });
    }

    const user =
      await UserBase.findById(
        userId,
      )
        .select(
          '-password -otp -otpExpiration -jwtToken',
        )
        .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          'User not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error(
      'GET ADMIN ERROR:',
      error,
    );

    return res.status(500).json({
      success: false,
      message:
        'Failed to fetch user',
    });
  }
};


// ============================================================
// CREATE ADMIN / MANAGEMENT USER
//
// POST /api/create/role
// ============================================================

const createAdmin = async (
  req,
  res,
) => {
  try {
    const {
      email,
      userType,
      firstName,
      middleName,
      lastName,
      phoneNumber,
      locationAccess,
      companyName,
      companyDesignation,
    } = req.body;

    const normalizedEmail =
      normalizeEmail(email);

    const normalizedUserType =
      normalizeText(
        userType,
      ).toLowerCase();

    if (
      !normalizedEmail ||
      !normalizedUserType ||
      !normalizeText(
        firstName,
      ) ||
      !normalizeText(
        lastName,
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Email, user type, first name and last name are required',
      });
    }

    const roleExists =
      await UserType.findOne({
        name:
          normalizedUserType,
        isActive: true,
      });

    if (!roleExists) {
      return res.status(400).json({
        success: false,
        message:
          'Invalid user type',
      });
    }

    const existingUser =
      await UserBase.findOne({
        email:
          normalizedEmail,
      });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message:
          'Email already exists',
      });
    }

    /*
     * Generate secure internal password.
     *
     * The user can use your existing
     * forgot-password flow to set
     * their own password.
     */
    const randomPassword =
      crypto
        .randomBytes(32)
        .toString('hex');

    const hashedPassword =
      await bcrypt.hash(
        randomPassword,
        12,
      );

    const user =
      await UserBase.create({
        email:
          normalizedEmail,

        password:
          hashedPassword,

        userType:
          normalizedUserType,

        firstName:
          normalizeText(
            firstName,
          ),

        middleName:
          normalizeText(
            middleName,
          ),

        lastName:
          normalizeText(
            lastName,
          ),

        phoneNumber:
          normalizeText(
            phoneNumber,
          ),

        locationAccess:
          normalizeText(
            locationAccess,
          ),

        companyName:
          normalizeText(
            companyName,
          ),

        companyDesignation:
          normalizeText(
            companyDesignation,
          ),

        isOtpVerified: true,

        status: 1,
      });

    return res.status(201).json({
      success: true,
      message:
        'Account created successfully',

      data: {
        _id: user._id,

        email:
          user.email,

        userType:
          user.userType,

        firstName:
          user.firstName,

        lastName:
          user.lastName,
      },
    });
  } catch (error) {
    console.error(
      'CREATE ADMIN ERROR:',
      error,
    );

    return res.status(500).json({
      success: false,
      message:
        'Failed to create account',
      error:
        process.env.NODE_ENV ===
        'development'
          ? error.message
          : undefined,
    });
  }
};


// ============================================================
// UPDATE ADMIN
// ============================================================

const updateAdmin = async (
  req,
  res,
) => {
  try {
    const { userId } = req.params;

    if (!isValidObjectId(userId)) {
      return res.status(400).json({
        success: false,
        message:
          'Invalid user ID',
      });
    }

    const user =
      await UserBase.findById(
        userId,
      );

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          'User not found',
      });
    }

    const {
      firstName,
      middleName,
      lastName,
      phoneNumber,
      userType,
      locationAccess,
    } = req.body;

    if (userType !== undefined) {
      const normalizedUserType =
        normalizeText(
          userType,
        ).toLowerCase();

      const roleExists =
        await UserType.findOne({
          name:
            normalizedUserType,
          isActive: true,
        });

      if (!roleExists) {
        return res.status(400).json({
          success: false,
          message:
            'Invalid user type',
        });
      }

      user.userType =
        normalizedUserType;
    }

    if (
      firstName !== undefined
    ) {
      user.firstName =
        normalizeText(
          firstName,
        );
    }

    if (
      middleName !== undefined
    ) {
      user.middleName =
        normalizeText(
          middleName,
        );
    }

    if (
      lastName !== undefined
    ) {
      user.lastName =
        normalizeText(
          lastName,
        );
    }

    if (
      phoneNumber !== undefined
    ) {
      user.phoneNumber =
        normalizeText(
          phoneNumber,
        );
    }

    if (
      locationAccess !== undefined
    ) {
      user.locationAccess =
        normalizeText(
          locationAccess,
        );
    }

    await user.save();

    const safeUser =
      await UserBase.findById(
        userId,
      )
        .select(
          '-password -otp -otpExpiration -jwtToken',
        )
        .lean();

    return res.status(200).json({
      success: true,
      message:
        'Account updated successfully',
      data: safeUser,
    });
  } catch (error) {
    console.error(
      'UPDATE ADMIN ERROR:',
      error,
    );

    return res.status(500).json({
      success: false,
      message:
        'Failed to update account',
    });
  }
};


// ============================================================
// DELETE ADMIN
// ============================================================

const deleteAdmin = async (
  req,
  res,
) => {
  try {
    const { userId } = req.params;

    if (!isValidObjectId(userId)) {
      return res.status(400).json({
        success: false,
        message:
          'Invalid user ID',
      });
    }

    if (
      String(req.user?._id) ===
      String(userId)
    ) {
      return res.status(400).json({
        success: false,
        message:
          'You cannot delete your own account',
      });
    }

    const user =
      await UserBase.findById(
        userId,
      );

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          'User not found',
      });
    }

    await UserBase.findByIdAndDelete(
      userId,
    );

    return res.status(200).json({
      success: true,
      message:
        'Account deleted successfully',
    });
  } catch (error) {
    console.error(
      'DELETE ADMIN ERROR:',
      error,
    );

    return res.status(500).json({
      success: false,
      message:
        'Failed to delete account',
    });
  }
};


// ============================================================
// REGIONS
//
// CreateAdminDialog expects:
//
// {
//   success: true,
//   data: [
//     {
//       _id,
//       regionName
//     }
//   ]
// }
// ============================================================

const getRegions = async (
  req,
  res,
) => {
  try {
    const regions =
      await Region.find({
        isActive: true,
      })
        .select(
          '_id regionName',
        )
        .sort({
          regionName: 1,
        })
        .lean();

    return res.status(200).json({
      success: true,
      data: regions,
    });
  } catch (error) {
    console.error(
      'GET REGIONS ERROR:',
      error,
    );

    return res.status(500).json({
      success: false,
      message:
        'Failed to fetch regions',
    });
  }
};


module.exports = {
  getUserTypes,
  createUserType,
  getUserTypeById,
  updateUserType,
  deleteUserType,

  getAdmins,
  getAdminById,
  createAdmin,
  updateAdmin,
  deleteAdmin,

  getRegions,
};