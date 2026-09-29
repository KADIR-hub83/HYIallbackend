require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const { UserBase } = require("../models/authModel");

const updateAdminCredentials = async () => {
  try {
    const args = process.argv.slice(2);

    const currentEmail = args[0];
    const newEmail = args[1];
    const newPassword = args[2];

    if (!currentEmail || !newEmail || !newPassword) {
      console.log(`
❌ Missing arguments.

Usage:

node scripts/updateAdminCredentials.js <currentEmail> <newEmail> <newPassword>

Example:

node scripts/updateAdminCredentials.js admin@hyi.ai newadmin@hyi.ai 'NewPassword@123'
      `);

      process.exit(1);
    }

    if (newPassword.length < 8) {
      console.error("❌ Password must be at least 8 characters.");
      process.exit(1);
    }

    // Use the same MongoDB env variable used by your backend.
    const mongoUri =
      process.env.MONGO_URI ||
      process.env.MONGODB_URI ||
      process.env.MONGO_URL;

    if (!mongoUri) {
      console.error(
        "❌ MongoDB connection URL not found in environment variables."
      );
      process.exit(1);
    }

    console.log("🔄 Connecting to database...");

    await mongoose.connect(mongoUri);

    console.log("✅ Database connected");

    const admin = await UserBase.findOne({
      email: currentEmail.toLowerCase().trim(),
    });

    if (!admin) {
      console.error(`❌ User not found: ${currentEmail}`);
      await mongoose.disconnect();
      process.exit(1);
    }

    // Safety check: only management/admin accounts
    const allowedRoles = [
      "admin",
      "super admin",
      "sales",
      "operations",
      "finance",
      "grievance",
    ];

    if (!allowedRoles.includes(admin.userType)) {
      console.error(
        `❌ This account is not an admin/management account. Role: ${admin.userType}`
      );

      await mongoose.disconnect();
      process.exit(1);
    }

    // Check whether new email belongs to another account
    if (currentEmail.toLowerCase() !== newEmail.toLowerCase()) {
      const emailExists = await UserBase.findOne({
        email: newEmail.toLowerCase().trim(),
        _id: { $ne: admin._id },
      });

      if (emailExists) {
        console.error(
          `❌ Another account already uses: ${newEmail}`
        );

        await mongoose.disconnect();
        process.exit(1);
      }
    }

    console.log("");
    console.log("Account found:");
    console.log("----------------------------");
    console.log(`ID:       ${admin._id}`);
    console.log(`Email:    ${admin.email}`);
    console.log(`Role:     ${admin.userType}`);
    console.log("----------------------------");
    console.log("");

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    admin.email = newEmail.toLowerCase().trim();
    admin.password = hashedPassword;

    // Invalidate existing login token if your model stores one.
    admin.jwtToken = null;

    await admin.save();

    console.log("✅ Admin credentials updated successfully.");
    console.log("");
    console.log(`New Email: ${admin.email}`);
    console.log(`Role:      ${admin.userType}`);
    console.log("");
    console.log("🔐 Password was stored as a bcrypt hash.");

    await mongoose.disconnect();

    process.exit(0);
  } catch (error) {
    console.error("");
    console.error("❌ Failed to update admin credentials:");
    console.error(error.message);

    try {
      await mongoose.disconnect();
    } catch {}

    process.exit(1);
  }
};

updateAdminCredentials();