import asyncHandler from "express-async-handler";
import mongoose from "mongoose";

import Artist from "../models/artistModel.js";
import User from "../models/userModel.js";

// @desc    get shortlisted profiles
// @route   GET /api/user/shortlist
// @access  Private
const getShortlist = (req, res) => {
  const shortlist = req.user.shortlist;
  res.json({ status: "success", shortlist });
};

// @desc    add/remove id in shortlist array
// @route   POST /api/user/shortlist
// @access  Private
const updateShortlist = asyncHandler(async (req, res) => {
  const { artist_id } = req.body;

  // validate artist ID
  if (
    !mongoose.Types.ObjectId.isValid(artist_id) ||
    !(await Artist.findById(artist_id))
  ) {
    res.status(404);
    throw new Error("Invalid Makeup Artist ID");
  }

  let shortlist = req.user.shortlist;

  // add (or) remove id from shortlist array
  if (req.body.action === "add") {
    if (!shortlist.includes(artist_id)) {
      shortlist.push(artist_id);
      await User.findByIdAndUpdate(req.user._id, { shortlist });
      return res.json({ status: "success", message: "Shortlist added" });
    }
  } else if (req.body.action === "remove") {
    shortlist = shortlist.filter((id) => String(id) !== artist_id);
    await User.findByIdAndUpdate(req.user._id, { shortlist });
    return res.json({ status: "success", message: "Shortlist removed" });
  }

  res.status(400);
  throw new Error("Invalid request");
});

const updateProfile = asyncHandler(async (req, res) => {});

export { getShortlist, updateShortlist, updateProfile };
