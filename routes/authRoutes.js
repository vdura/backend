import express from "express";
import {
  sendOTP,
  verifyOTP,
  verifyPassword,
  signupUsingOTP,
} from "../controllers/authController.js";

const router = express.Router();

//@root-route /api/auth/
router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);
router.post("/verify-password", verifyPassword);
router.post("/signup-using-otp", signupUsingOTP);

export default router;
