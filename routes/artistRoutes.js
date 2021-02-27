import express from "express";
import {
  getArtistList,
  getArtistProfile,
} from "../controllers/artistController.js";

const router = express.Router();

//@root-route /api/artist/
router.get("/list", getArtistList);
router.get("/:id", getArtistProfile);

export default router;
