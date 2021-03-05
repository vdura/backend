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

const reviewSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    desc: { type: String, required: true },
    date: {
      type: Date,
      default: () => new Date(),
    },
  },
  {
    timestamps: true,
  }
);

const artistSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    rating: {
      average: {
        type: Number,
        required: true,
        default: 0,
        min: 0,
        max: 5,
      },
      totalCount: {
        type: Number,
        required: true,
        default: 0,
      },
      individualCount: {
        //TODO: check for totalCount == sum of individualCount
        1: {
          type: Number,
          required: true,
          default: 0,
        },
        2: {
          type: Number,
          required: true,
          default: 0,
        },
        3: {
          type: Number,
          required: true,
          default: 0,
        },
        4: {
          type: Number,
          required: true,
          default: 0,
        },
        5: {
          type: Number,
          required: true,
          default: 0,
        },
      },
    },
    review: {
      totalCount: {
        type: Number,
        required: true,
        default: 0,
      },
      data: [reviewSchema],
    },
    qualification: {
      type: String,
    },
    services: [
      {
        type: String,
        required: true,
      },
    ],

    // numReview: {
    //   type: Number,
    //   required: true,
    //   default: 0,
    // },
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
      required: true,
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
