import express from "express";
import {
  getShortlist,
  updateShortlist,
  updateProfile,
} from "../controllers/userController.js";
import { restricted } from "../middleware/authMiddleware.js";

const router = express.Router();

//@root-route /api/user/
router.get("/shortlist", restricted, getShortlist);
router.post("/shortlist", restricted, updateShortlist);
// router.post("/update-profile", restricted, updateProfile);

export default router;
