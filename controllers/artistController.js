import asyncHandler from "express-async-handler";
import Artist from "../models/artistModel.js";

// @desc    get all artists profile - using appropriate filters and sortBy
//          filters:  category / rating / price range / travel / date(later)
// @route   GET /api/artist
// @access  Public
const getArtistList = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;

  const filters = JSON.parse(req.query.filters);
  const sortBy = req.query.sortBy ? req.query.sortBy : "rating";
  const sortByObj = JSON.parse(`{"${sortBy}" :1}`);

  console.log("sortBy", sortByObj);
  console.log("all-filters", filters.TRAVEL);

  //Filters
  const reqCategory = filters.CATEGORY ? filters.CATEGORY : [/./];
  const reqRating = filters.RATING ? filters.RATING : 0;
  const reqPriceMin = filters.PRICE?.min ? filters.PRICE.min : 0;
  const reqPriceMax = filters.PRICE?.max
    ? filters.PRICE.max
    : Number.POSITIVE_INFINITY;
  const reqCanTravel = filters.TRAVEL ? filters.TRAVEL : ["y", "n"];

  const result = await Artist.find({
    category: { $in: reqCategory },
    rating: { $gte: reqRating },
    startPrice: { $gte: reqPriceMin, $lte: reqPriceMax },
    canTravel: { $in: reqCanTravel },
  });

  console.log(result);
  console.log("sort-by", sortBy);
  // console.log();
  res.json(result);
});

const getArtistProfile = asyncHandler(async (req, res) => {});

export { getArtistList, getArtistProfile };
