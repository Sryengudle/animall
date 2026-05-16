const User = require("../models/User");

const { TWILIO_AUTH_TOKEN, TWILIO_ACCOUNT_SID, TWILIO_SERVICE_SID } = process.env;

const client = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

// Initialize your Twilio Client with environment variables
const accountSid = process.env.TWILIO_ACCOUNT_SID; // Starts with 'AC'
const authToken = process.env.TWILIO_AUTH_TOKEN;   // Your Auth Token
const verifyServiceSid = process.env.TWILIO_SERVICE_SID; // CRITICAL: Must start with 'VA'

// Helper: generate 6-digit OTP
const genOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const sendOtp = async (req, res) => {
  const { phone } = req.body ?? {};

  try {

      const otp = genOTP();
      await client.messages.create({
        body: `Your OTP is ${otp}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: `+91${phone}`, // Double-check Geo-Permissions for India in your console,
      });
      const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 min

    await User.findOneAndUpdate(
      { phone },
      { otp, otpExpiry },
      { upsert: true, new: true }
    );

    res.status(200).send({
      success: true,
      message: `OTP sent successfully`,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: `Error in sending otp: ${err.message}`,
    });
  }
};

const verifyOtp = async (req, res) => {

    const { phone, otp } = req.body;
    if (!phone || !otp)
      return res.status(400).json({ message: 'Phone and OTP required' });
  
    try {
      const user = await User.findOne({ phone });
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      if (user.otp !== otp || user.otpExpiry < new Date())
        return res.status(400).json({ message: 'Invalid or expired OTP' });
  
      user.otp = undefined;
      user.otpExpiry = undefined;
      await user.save();
  
      res.json({
        token: signToken(user._id),
        user: publicUser(user),
      });
    } catch (err) {
    res.status(500).send({
      success: false,
      message: `Error in verifying otp: ${err.message}`,
    });
    }

  // const { phone, otp } = req.body ?? {};

  //   try {
  //   const result = await client.verify
  //     .services(TWILIO_SERVICE_SID)
  //     .verificationChecks.create({
  //       to: `+${phone}`,
  //       code: otp,
  //     });
  //   res.status(200).send({
  //     success: true,
  //     message: `OTP verified successfully`,
  //     payload: result,
  //   });
  // } catch (err) {
  //   res.status(500).send({
  //     success: false,
  //     message: `Error in verifying otp: ${err.message}`,
  //   });
  // }
};

module.exports = { sendOtp, verifyOtp };
