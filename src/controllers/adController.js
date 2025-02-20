const asyncHandler = require("express-async-handler");
const Ad = require("../models/Ad.js");

// @ post
// @ route /ads
const recordAd = asyncHandler(async (req, res) => {
  const { title, description, price, link } = req.body;
  if (!title || !description || !price || !link) {
    res.status(400);
    throw new Error("Please fill out all fields");
  }
  const ad = await Ad.create({
    title,
    description,
    price,
    link,
    user: req.user.id,
  });
  res.status(200).json(ad);
});
// @ get add /ads
const getAd = asyncHandler(async (req, res) => {
  const ads = await Ad.find({});
  res.status(200).json(ads);
});
module.exports = { recordAd, getAd };
