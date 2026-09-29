const mongoose = require("mongoose");

const getCollection = (name) => {
  return mongoose.connection.db.collection(name);
};

const getTodayRange = () => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date();
  end.setHours(23, 59, 59, 999);

  return {
    $gte: start,
    $lte: end,
  };
};

const safeCount = async (collection, query = {}) => {
  try {
    return await collection.countDocuments(query);
  } catch (error) {
    console.error(
      `Count error for ${collection.collectionName}:`,
      error.message
    );

    return 0;
  }
};

exports.getSuperAdminDashboard = async (req, res) => {
  try {
    const db = mongoose.connection.db;

    if (!db) {
      return res.status(500).json({
        success: false,
        message: "Database connection is not available",
      });
    }

    const users = getCollection("users");
    const jobseekers = getCollection("jobseekers");
    const companies = getCollection("companies");
    const projects = getCollection("projects");
    const mockresults = getCollection("mockresults");

    const today = getTodayRange();

    /*
     * ------------------------------------------------------
     * REGISTRATION
     * ------------------------------------------------------
     */

    const [
      totalTalentRegistration,
      todayTalentRegistration,

      totalCompanyRegistration,
      todayCompanyRegistration,

      totalTalentRegistrationComplete,
      todayTalentRegistrationComplete,

      totalCompanyRegistrationComplete,
      todayCompanyRegistrationComplete,
    ] = await Promise.all([
      safeCount(users, {
        userType: "talent",
      }),

      safeCount(users, {
        userType: "talent",
        createdAt: today,
      }),

      safeCount(users, {
        userType: "company",
      }),

      safeCount(users, {
        userType: "company",
        createdAt: today,
      }),

      safeCount(jobseekers, {
        $or: [
          { onboardingCompleted: true },
          { talentOnboadCompleted: true },
        ],
      }),

      safeCount(jobseekers, {
        $and: [
          {
            $or: [
              { onboardingCompleted: true },
              { talentOnboadCompleted: true },
            ],
          },
          {
            createdAt: today,
          },
        ],
      }),

      safeCount(companies, {
        $or: [
          { organizationOnboardCompleted: true },
          { organizationOnboadCompleted: true },
        ],
      }),

      safeCount(companies, {
        $and: [
          {
            $or: [
              { organizationOnboardCompleted: true },
              { organizationOnboadCompleted: true },
            ],
          },
          {
            createdAt: today,
          },
        ],
      }),
    ]);

    /*
     * Partial registration
     *
     * User registered but onboarding/profile isn't completed.
     *
     * Using Math.max prevents negative values if legacy data
     * contains profiles without matching users.
     */

    const talentPartialRegistrations = Math.max(
      totalTalentRegistration -
        totalTalentRegistrationComplete,
      0
    );

    const todayTalentPartialRegistrations = Math.max(
      todayTalentRegistration -
        todayTalentRegistrationComplete,
      0
    );

    const companyPartialRegistrations = Math.max(
      totalCompanyRegistration -
        totalCompanyRegistrationComplete,
      0
    );

    const todayCompanyPartialRegistrations = Math.max(
      todayCompanyRegistration -
        todayCompanyRegistrationComplete,
      0
    );

    /*
     * ------------------------------------------------------
     * ONBOARDING
     * ------------------------------------------------------
     *
     * Your current database uses the onboarding completion
     * fields shown above.
     */

    const totalTalentOnboarding =
      totalTalentRegistrationComplete;

    const todayTalentOnboarding =
      todayTalentRegistrationComplete;

    const totalCompanyOnboarding =
      totalCompanyRegistrationComplete;

    const todayCompanyOnboarding =
      todayCompanyRegistrationComplete;

    /*
     * ------------------------------------------------------
     * ACTIVE USERS
     * ------------------------------------------------------
     *
     * users.status = 1 exists in your current documents.
     */

    const [
      totalActiveTalent,
      totalActiveCompany,
    ] = await Promise.all([
      safeCount(users, {
        userType: "talent",
        status: 1,
      }),

      safeCount(users, {
        userType: "company",
        status: 1,
      }),
    ]);

    /*
     * ------------------------------------------------------
     * VERIFICATION
     * ------------------------------------------------------
     *
     * IMPORTANT:
     *
     * Your supplied documents DO NOT contain a dedicated
     * talent/company verification-status field.
     *
     * Therefore we must not invent verified counts.
     */

    const totalVerifiedTalent = 0;
    const totalVerifiedCompany = 0;

    const totalTalentVerificationPending = 0;
    const totalCompanyVerificationPending = 0;

    const todayTalentVerificationPending = 0;
    const todayCompanyVerificationPending = 0;

    /*
     * ------------------------------------------------------
     * PROJECTS
     * ------------------------------------------------------
     *
     * projects collection currently exists but is empty.
     */

    const totalProjects =
      await safeCount(projects);

    /*
     * We don't yet know the actual project status field/value,
     * so don't guess completed/live statuses.
     */

    const totalCompletedProject = 0;
    const totalLiveProject = totalProjects;

    /*
     * ------------------------------------------------------
     * MOCK TEST / ASSESSMENTS
     * ------------------------------------------------------
     *
     * mockresults currently contains zero documents.
     */

    const totalCompletedMockTest =
      await safeCount(mockresults);

    const todayCompletedMockTest =
      await safeCount(mockresults, {
        createdAt: today,
      });

    /*
     * If one mockresult represents one talent attempt,
     * these values are currently equivalent.
     *
     * Once mockresults has real documents we can change this
     * to distinct-user counting if necessary.
     */

    const totalTalentMockTestCompleted =
      totalCompletedMockTest;

    const todayTalentMockTestCompleted =
      todayCompletedMockTest;

    /*
     * ------------------------------------------------------
     * CURRENTLY UNSUPPORTED COLLECTIONS
     * ------------------------------------------------------
     *
     * Your current DB dump did not show collections for:
     *
     * teams
     * tickets/escalations
     * payments
     * leads
     * screening interviews
     *
     * Keep these zero instead of returning fake data.
     */

    const dashboardData = {
      /*
       * Talent registration
       */

      totalTalentRegistration,
      todayTalentRegistration,

      totalTalentRegistrationComplete,
      todayTalentRegistrationComplete,

      talentPartialRegistrations,
      todayTalentPartialRegistrations,

      /*
       * Company registration
       */

      totalCompanyRegistration,
      todayCompanyRegistration,

      totalCompanyRegistrationComplete,
      todayCompanyRegistrationComplete,

      companyPartialRegistrations,
      todayCompanyPartialRegistrations,

      /*
       * Onboarding
       */

      totalTalentOnboarding,
      todayTalentOnboarding,

      totalCompanyOnboarding,
      todayCompanyOnboarding,

      /*
       * Verification
       */

      totalVerifiedTalent,
      totalVerifiedCompany,

      totalTalentVerificationPending,
      totalCompanyVerificationPending,

      todayTalentVerificationPending,
      todayCompanyVerificationPending,

      /*
       * Active users
       */

      totalActiveTalent,
      totalActiveCompany,

      /*
       * Screening
       */

      totalScreeningInterview: 0,
      todayScreeningInterview: 0,

      /*
       * Assessment
       */

      totalCompletedMockTest,
      todayCompletedMockTest,

      totalTalentMockTestCompleted,
      todayTalentMockTestCompleted,

      /*
       * Projects
       */

      totalCompletedProject,
      totalLiveProject,

      /*
       * Teams
       */

      totalTeams: 0,
      todayTeams: 0,

      /*
       * Escalations
       */

      totalEscalationTicketClosed: 0,
      totalEscalationOpened: 0,

      todayEscalationTicketClosed: 0,
      todayEscalationTicketOpened: 0,

      /*
       * Finance
       */

      totalRefunded: 0,

      totalPayIn: 0,
      todayPayIn: 0,

      totalPayOut: 0,
      todayPayOut: 0,

      totalPaymentRequest: 0,
      todayPaymentRequest: 0,

      totalPaymentRequestAmount: 0,

      /*
       * Sales
       */

      totalLeads: 0,
      totalConversion: 0,
      todayConversion: 0,
    };

    console.log(
      "\n===== SUPER ADMIN DASHBOARD ====="
    );

    console.log(
      JSON.stringify(
        dashboardData,
        null,
        2
      )
    );

    return res.status(200).json({
      success: true,
      data: dashboardData,
    });
  } catch (error) {
    console.error(
      "Super admin dashboard error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch dashboard data",
      error: error.message,
    });
  }
};


/*
 * ==========================================================
 * SALES
 * ==========================================================
 */

exports.getSalesDashboard = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,

      data: {
        totalLeads: 0,
        totalConversion: 0,
        todayConversion: 0,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch sales dashboard",
      error: error.message,
    });
  }
};


/*
 * ==========================================================
 * FINANCE
 * ==========================================================
 */

exports.getFinanceDashboard = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,

      data: {
        totalRefunded: 0,

        totalPayIn: 0,
        todayPayIn: 0,

        totalPayOut: 0,
        todayPayOut: 0,

        totalPaymentRequest: 0,
        todayPaymentRequest: 0,

        totalPaymentRequestAmount: 0,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch finance dashboard",
      error: error.message,
    });
  }
};


/*
 * ==========================================================
 * GRIEVANCE
 * ==========================================================
 */

exports.getGrievanceDashboard = async (
  req,
  res
) => {
  try {
    return res.status(200).json({
      success: true,

      data: {
        totalEscalationTicketClosed: 0,
        totalEscalationOpened: 0,

        todayEscalationTicketClosed: 0,
        todayEscalationTicketOpened: 0,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch grievance dashboard",
      error: error.message,
    });
  }
};


/*
 * ==========================================================
 * OPERATIONS
 * ==========================================================
 */

exports.getOperationsDashboard = async (
  req,
  res
) => {
  try {
    const projects =
      getCollection("projects");

    const totalProjects =
      await safeCount(projects);

    return res.status(200).json({
      success: true,

      data: {
        totalCompletedProject: 0,
        totalLiveProject: totalProjects,

        totalTeams: 0,
        todayTeams: 0,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch operations dashboard",
      error: error.message,
    });
  }
};