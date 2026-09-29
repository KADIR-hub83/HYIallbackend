const { Lead } = require("../models/leadModel");

const createLead = async (req, res) => {
  try {
    const {
      fullName,
      gender,
      email,
      phoneNumber,
      companyName,
      country,
      timeZone,
      preferToCallTime,
      preferredCountries,
      preferredTimeZone,
      salaryPerHourFrom,
      salaryPerHourTo,
      keySkills,
      numberOfTalentRequired,
      workPreference,
      profileStatus,
    } = req.body;

    if (
      !Array.isArray(keySkills) ||
      keySkills.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "At least one key skill is required.",
      });
    }

    if (
      !numberOfTalentRequired ||
      Number(numberOfTalentRequired) < 1
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Number of talent required must be at least 1.",
      });
    }

    const lead = new Lead({
      fullName,
      gender,
      email,
      phoneNumber,
      companyName,
      country,
      timeZone,
      preferToCallTime,

      preferredCountries:
        Array.isArray(preferredCountries)
          ? preferredCountries
          : [],

      preferredTimeZone:
        Array.isArray(preferredTimeZone)
          ? preferredTimeZone
          : [],

      salaryPerHourFrom,
      salaryPerHourTo,
      keySkills,

      numberOfTalentRequired:
        Number(numberOfTalentRequired),

      workPreference,
      profileStatus,
    });

    await lead.save();

    return res.status(201).json({
      success: true,
      message: "Lead created successfully.",
      data: lead,
    });
  } catch (error) {
    console.error(
      "Create lead error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to create lead.",
      error: error.message,
    });
  }
};

module.exports = {
  createLead,
};