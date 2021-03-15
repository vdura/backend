import asyncHandler from "express-async-handler";
import Artist from "../models/artistModel.js";

// @desc    get all artists profile - using appropriate filters and sortBy
//          filters:  category / rating / price range / travel / date(later)
//          sort: rating/ price/ exp
// @route   GET /api/artist
// @access  Public
const getArtistList = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;

  const filters = JSON.parse(req.query.filters);
  let sortBy = req.query.sortBy ? req.query.sortBy : "-rating.average";
  if (sortBy === "-rating") {
    sortBy = "-rating.average";
  }

  console.log("all-filters", filters);

  //Filters
  const reqCategory = filters.CATEGORY ? filters.CATEGORY : [/./];
  const reqRating = filters.RATING ? filters.RATING : 0;
  const reqPriceMin = filters.PRICE?.min ? filters.PRICE.min : 0;
  const reqPriceMax = filters.PRICE?.max
    ? filters.PRICE.max
    : Number.POSITIVE_INFINITY;
  const reqCanTravel = filters.TRAVEL ? filters.TRAVEL : ["y", "n"];

  const query = {
    category: { $in: reqCategory },
    "rating.average": { $gte: reqRating },
    startPrice: { $gte: reqPriceMin, $lte: reqPriceMax },
    canTravel: { $in: reqCanTravel },
  };

  const result = await Artist.find(query)
    .skip(pageSize * (page - 1))
    .limit(pageSize)
    .sort(sortBy)
    .select(
      " name rating numReview startPrice exp sid profileImage displayImages"
    );

  const totalProfile = await Artist.countDocuments(query);

  if (sortBy === "-rating.average") {
    sortBy = "-rating";
  }

  const response_data = {
    totalProfile,
    page,
    filters,
    sortBy,
    data: result,
  };

  // console.log(result);
  // console.log("sort-by", sortBy);
  // console.log();
  res.json(response_data);
});

const getArtistProfile = asyncHandler(async (req, res) => {
  const artist_profile = await Artist.findById(req.params.id).select(
    "-createdAt -updatedAt -__v"
  );
  if (artist_profile === null) {
    res.status(404);
    throw new Error("Makeup Artist not found");
  }

  res.json(artist_profile);
});

export { getArtistList, getArtistProfile };
