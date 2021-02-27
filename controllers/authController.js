import asyncHandler from "express-async-handler";
import axios from "axios";
import User from "../models/userModel.js";
import OtpSession from "../models/otpSessionModel.js";
import generateToken from "../utils/generateToken.js";

const mobile_IN_regex = new RegExp("^[6789]\\d{9}$");

// @desc    send OTP, check whether user is registered
// @route   POST /api/auth/send-otp
// @access  Public
const sendOTP = asyncHandler(async (req, res) => {
  const { phone } = req.body;

  //Validate phone number
  if (!phone || !mobile_IN_regex.test(phone)) {
    res.status(400);
    throw new Error("Invalid Phone Number");
  }

  const url = `https://2factor.in/API/V1/${process.env.OTP_API_KEY}/SMS/+91${phone}/AUTOGEN`;
  let sessionID;

  //Send OTP
  try {
    const response = await axios.get(url);
    sessionID = response.data.Details;
  } catch (err) {
    if (err.response) {
      console.log(err.response.data);
      res.status(400);
      throw new Error(err.response.data.Details);
    } else {
      res.status(500);
      throw new Error("Internal Server Error");
    }
  }

  const otpSessionExist = await OtpSession.findOne({ phone });

  //Save (or) Update OTP session in DB
  if (otpSessionExist) {
    await OtpSession.updateOne({ phone }, { session: sessionID });
  } else {
    await OtpSession.insertMany({ phone, session: sessionID });
  }

  const user = await User.findOne({ phone });

  if (user) {
    res.json({
      phone,
      isRegistered: true,
      message: "OTP sent successfully",
    });
  } else {
    res.json({
      phone,
      isRegistered: false,
      message: "OTP sent successfully",
    });
  }
});

// @desc    verify OTP and send token if registered (LOGIN)
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOTP = asyncHandler(async (req, res) => {
  const { phone, otp } = req.body;

  const dbOtp = await OtpSession.findOne({ phone });

  // Check response session matches with the stored session
  // if (dbOtp.session !== sessionID) {
  //   res.status(400);
  //   throw new Error("Invalid sessionID");
  // }
  const sessionID = dbOtp.session;

  const url = `https://2factor.in/API/V1/${process.env.OTP_API_KEY}/SMS/VERIFY/${sessionID}/${otp}`;

  try {
    const response = await axios.get(url);

    if (response.data.Details === "OTP Expired") {
      res
        .status(400)
        .json({ message: response.data.Details, isVerfied: false });
    }
  } catch (err) {
    if (err.response) {
      console.log(err.response.data);
      res
        .status(400)
        .json({ message: err.response.data.Details, isVerfied: false });
    } else {
      res.status(500);
      throw new Error("Internal Server Error");
    }
  }

  const user = await User.findOne({ phone });

  if (user) {
    res.json({
      message: "OTP Matched",
      _id: user._id,
      fname: user.fname,
      token: generateToken(user._id),
      isVerfied: true,
    });
  } else {
    res.status(401).json({ message: "User not registered", isVerfied: false });
  }
});

// @desc    verify password and send token (LOGIN)
// @route   POST /api/auth/verify-password
// @access  Public
const verifyPassword = asyncHandler(async (req, res) => {
  const { phone, password } = req.body;

  const user = await User.findOne({ phone });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      fname: user.fname,
      token: generateToken(user._id),
      isVerfied: true,
    });
  } else {
    res
      .status(401)
      .json({ message: "Invalid phone or password", isVerfied: false });
  }
});

// @desc    verify OTP and register a new user (SIGNUP)
// @route   POST /api/auth/signup-using-otp
// @access  Public
const signupUsingOTP = asyncHandler(async (req, res) => {
  const { fname, lname, email, phone, password, otp } = req.body;

  const dbOtp = await OtpSession.findOne({ phone });

  // Check response session matches with the stored session
  // if (dbOtp.session !== sessionID) {
  //   res.status(400);
  //   throw new Error("Invalid sessionID");
  // }
  const sessionID = dbOtp.session;
  const url = `https://2factor.in/API/V1/${process.env.OTP_API_KEY}/SMS/VERIFY/${sessionID}/${otp}`;

  try {
    const response = await axios.get(url);
    if (response.data.Details === "OTP Expired") {
      res
        .status(400)
        .json({ message: response.data.Details, isVerfied: false });
    }
  } catch (err) {
    if (err.response) {
      console.log(err.response.data);
      res
        .status(400)
        .json({ message: err.response.data.Details, isVerfied: false });
    } else {
      res.status(500);
      throw new Error("Internal Server Error");
    }
  }

  let user = await User.findOne({ phone });

  if (!user) {
    user = await User.create({ fname, lname, email, phone, password });

    res.json({
      _id: user._id,
      fname: user.fname,
      token: generateToken(user._id),
      isVerfied: true,
    });
  } else {
    res.status(400).json({ message: "User is already registered" });
  }
});

export { sendOTP, verifyOTP, verifyPassword, signupUsingOTP };
