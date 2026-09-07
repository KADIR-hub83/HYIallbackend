'use strict';

require('dotenv').config();

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');
const { UserBase } = require('./models/authModel');

async function resetAdmin() {
  const email = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD || '';
  const currentEmail = (
    process.env.CURRENT_ADMIN_EMAIL || ''
  ).trim().toLowerCase();

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI backend/.env mein missing hai');
  }

  if (!validator.isEmail(email)) {
    throw new Error('Valid admin email enter karo');
  }

  if (!validator.isStrongPassword(password)) {
    throw new Error(
      'Password mein minimum 8 characters, uppercase, lowercase, number aur symbol hona chahiye',
    );
  }

  await mongoose.connect(process.env.MONGO_URI);

  const admins = await UserBase.find({
    userType: 'admin',
  }).select('_id email');

  let admin;

  if (currentEmail) {
    admin = await UserBase.findOne({
      email: currentEmail,
      userType: 'admin',
    });

    if (!admin) {
      throw new Error(`Admin nahi mila: ${currentEmail}`);
    }
  } else if (admins.length === 1) {
    admin = await UserBase.findById(admins[0]._id);
  } else if (admins.length > 1) {
    throw new Error(
      `Multiple admins mile: ${admins
        .map((item) => item.email)
        .join(', ')}. CURRENT_ADMIN_EMAIL set karke dobara run karo.`,
    );
  } else {
    const existingUser = await UserBase.findOne({ email });

    if (existingUser) {
      throw new Error(
        'Ye email already ek non-admin account ke paas hai',
      );
    }

    admin = new UserBase({ email });
  }

  const conflictingUser = await UserBase.findOne({
    email,
    _id: { $ne: admin._id },
  });

  if (conflictingUser) {
    throw new Error('New email already kisi account ke paas hai');
  }

  admin.email = email;
  admin.password = await bcrypt.hash(password, 10);
  admin.userType = 'admin';
  admin.isOtpVerified = true;
  admin.status = 1;
  admin.jwtToken = null;
  admin.otp = null;
  admin.otpExpiration = null;

  await admin.save();

  console.log(`✅ Admin successfully updated: ${admin.email}`);
}

resetAdmin()
  .catch((error) => {
    console.error(`❌ ${error.message}`);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });