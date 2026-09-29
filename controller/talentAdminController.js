const mongoose = require("mongoose");
const { Jobseeker } = require("../models/jobseekerModel");

const getTotalTalentRegistrations = async (req, res) => {
  try {
    const db = mongoose.connection.db;

    if (!db) {
      return res.status(500).json({
        success: false,
        message: "Database connection is not available",
      });
    }

    const jobseekers = db.collection("jobseekers");
    const users = db.collection("users");

    const page = Math.max(
      Number.parseInt(req.query.page, 10) || 1,
      1
    );

    const limit = Math.min(
      Math.max(
        Number.parseInt(req.query.limit, 10) || 10,
        1
      ),
      100
    );

    const skip = (page - 1) * limit;

    const clickable = String(
      req.query.clickable || "totalTalentRegistration"
    );

    const filter = {};

    /*
     * ---------------------------------------------
     * ONBOARDING FILTER
     * ---------------------------------------------
     */

    if (
      clickable === "totalTalentRegistrationComplete" ||
      clickable === "totalTalentOnboarding"
    ) {
      filter.$or = [
        {
          onboardingCompleted: true,
        },
        {
          talentOnboadCompleted: true,
        },
      ];
    }

    if (
      clickable === "talentPartialRegistrations" ||
      clickable === "totalTalentRegistrationIncomplete"
    ) {
      filter.$and = [
        {
          onboardingCompleted: {
            $ne: true,
          },
        },
        {
          talentOnboadCompleted: {
            $ne: true,
          },
        },
      ];
    }

    /*
     * ---------------------------------------------
     * SEARCH
     * ---------------------------------------------
     */

    const search = String(
      req.query.search || req.query.q || ""
    ).trim();

    if (search) {
      const searchRegex = new RegExp(
        search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        "i"
      );

      const searchFilter = {
        $or: [
          {
            firstName: searchRegex,
          },
          {
            lastName: searchRegex,
          },
          {
            fullName: searchRegex,
          },
          {
            email: searchRegex,
          },
        ],
      };

      if (filter.$and) {
        filter.$and.push(searchFilter);
      } else if (filter.$or) {
        filter.$and = [
          {
            $or: filter.$or,
          },
          searchFilter,
        ];

        delete filter.$or;
      } else {
        Object.assign(
          filter,
          searchFilter
        );
      }
    }

    /*
     * ---------------------------------------------
     * FETCH JOBSEEKERS
     * ---------------------------------------------
     */

    const [total, talentDocuments] =
      await Promise.all([
        jobseekers.countDocuments(filter),

        jobseekers
          .find(filter)
          .sort({
            createdAt: -1,
          })
          .skip(skip)
          .limit(limit)
          .toArray(),
      ]);

    /*
     * ---------------------------------------------
     * FETCH LINKED USERS
     * ---------------------------------------------
     */

    const userIds = talentDocuments
      .map((talent) => talent.user)
      .filter(Boolean);

    const userDocuments =
      userIds.length > 0
        ? await users
            .find({
              _id: {
                $in: userIds,
              },
            })
            .toArray()
        : [];

    const usersById = new Map(
      userDocuments.map((user) => [
        String(user._id),
        user,
      ])
    );

    /*
     * ---------------------------------------------
     * FORMAT RESPONSE
     * ---------------------------------------------
     */

    const talents = talentDocuments.map(
      (talent) => {
        const user = talent.user
          ? usersById.get(
              String(talent.user)
            )
          : null;

        return {
          ...talent,

          fullName:
            talent.fullName ||
            [
              talent.firstName ||
                user?.firstName,
              talent.middleName ||
                user?.middleName,
              talent.lastName ||
                user?.lastName,
            ]
              .filter(Boolean)
              .join(" "),

          email:
            talent.email ||
            user?.email ||
            "",

          firstName:
            talent.firstName ||
            user?.firstName ||
            "",

          middleName:
            talent.middleName ||
            user?.middleName ||
            "",

          lastName:
            talent.lastName ||
            user?.lastName ||
            "",

          userType:
            user?.userType ||
            "talent",

          status:
            user?.status ?? null,

          isOtpVerified:
            user?.isOtpVerified ??
            false,

          onboardingCompleted:
            talent.onboardingCompleted === true ||
            talent.talentOnboadCompleted === true,

          talentOnboadCompleted:
            talent.talentOnboadCompleted === true,
        };
      }
    );

    /*
     * ---------------------------------------------
     * RESPONSE
     * ---------------------------------------------
     */

    return res.status(200).json({
      success: true,

      data: talents,

      total,

      count: talents.length,

      currentPage: page,

      page,

      limit,

      totalPages:
        total === 0
          ? 1
          : Math.ceil(total / limit),
    });
  } catch (error) {
    console.error(
      "GET TOTAL TALENT REGISTRATIONS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to fetch talent registrations",

      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};

const getTalentPublicProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    let talent = await Jobseeker.findOne({
      user: userId,
    }).lean();

    // Also support Jobseeker document _id
    if (!talent && mongoose.Types.ObjectId.isValid(userId)) {
      talent = await Jobseeker.findById(userId).lean();
    }

    if (!talent) {
      return res.status(404).json({
        success: false,
        message: "Talent not found",
      });
    }

    const latestExperience =
      Array.isArray(talent.experience) &&
      talent.experience.length > 0
        ? talent.experience[talent.experience.length - 1]
        : null;

    return res.status(200).json({
      ...talent,

      latestDesignation:
        latestExperience?.designation || "",
    });
 } catch (error) {
  console.error("GET TALENT PUBLIC PROFILE ERROR:", error);

  return res.status(500).json({
    success: false,
    message: "Failed to fetch talent public profile",
    error: error.message,
    stack: error.stack,
  });
}
};

module.exports = {
  getTotalTalentRegistrations,
  getTalentPublicProfile,
};