import mongoose from "mongoose";

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
  },
  { timestamps: true }
);

const Artist = mongoose.model("Artist", artistSchema);

export default Artist;
