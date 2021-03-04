import mongoose from "mongoose";
import { nanoid } from "nanoid";

const packageSchema = mongoose.Schema({
  _id: {
    type: String,
    default: () => nanoid(4),
  },
  name: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
  //TODO: per head packages
});

const artistSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
      max: 5,
    },
    numReview: {
      type: Number,
      required: true,
      default: 0,
    },
    startPrice: {
      type: Number,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    canTravel: {
      type: String,
      required: true,
    },
    exp: {
      type: Number,
      required: true,
    },
    category: [
      {
        type: String,
        enum: [
          "wedding",
          "fashion",
          "creative",
          "party",
          "advertising",
          "event",
        ],
        required: true,
      },
    ],
    about: {
      type: String,
    },
    packages: [packageSchema],
    sid: {
      type: String,
      default: () => nanoid(5),
    },
  },
  { timestamps: true }
);

const Artist = mongoose.model("Artist", artistSchema);

export default Artist;
