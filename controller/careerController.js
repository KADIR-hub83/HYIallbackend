const { Career } = require('../models/careerModel');

const {
  sendUserConfirmationEmail,
  sendHrNotificationEmail,
} = require('../utils/EmailSender');

const { uploadFileToS3 } = require('../utils/awsS3');

const careerForm = async (req, res) => {
  try {
    console.log('===== CAREER FORM =====');
    console.log('BODY:', req.body);
    console.log('FILE:', req.file?.originalname);

    const {
      name,
      designation,
      email,
      phoneNumber,
      message,
    } = req.body;

    // ==============================
    // VALIDATION
    // ==============================
    if (
      !name ||
      !email ||
      !phoneNumber ||
      !req.file
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Name, email, phone number and CV are required.',
      });
    }

    // ==============================
    // SPLIT FULL NAME
    // ==============================
    const normalizedName = name.trim();

    const nameParts = normalizedName
      .split(/\s+/)
      .filter(Boolean);

    const firstName = nameParts[0] || '';

    const lastName =
      nameParts.length > 1
        ? nameParts.slice(1).join(' ')
        : '-';

    // ==============================
    // UPLOAD CV TO SUPABASE
    // ==============================
    const resumeUrl = await uploadFileToS3(
      req.file,
      'career-resumes/'
    );

    if (!resumeUrl) {
      return res.status(500).json({
        success: false,
        message: 'CV upload failed.',
      });
    }

    // ==============================
    // SAVE TO DATABASE
    // ==============================
    const newCareer = new Career({
      firstName,
      lastName,
      designation: designation || '',
      email: email.trim().toLowerCase(),
      phoneNumber,
      message: message || '',
      resume: resumeUrl,
    });

    await newCareer.save();

    // ==============================
    // EMAILS
    // ==============================
    try {
      await sendUserConfirmationEmail(
        email,
        firstName
      );
    } catch (emailError) {
      console.error(
        'User confirmation email failed:',
        emailError
      );
    }

    try {
      await sendHrNotificationEmail({
        firstName,
        lastName,
        email,
        phoneNumber,
        message,
        resume: resumeUrl,
      });
    } catch (emailError) {
      console.error(
        'HR notification email failed:',
        emailError
      );
    }

    // ==============================
    // SUCCESS RESPONSE
    // ==============================
    return res.status(201).json({
      success: true,
      message:
        'Application submitted successfully.',
      data: {
        firstName,
        lastName,
        email,
        phoneNumber,
        designation,
        resume: resumeUrl,
      },
    });
  } catch (error) {
    console.error(
      'CAREER FORM ERROR:',
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error?.message ||
        'Something went wrong. Please try again later.',
    });
  }
};

module.exports = {
  careerForm,
};