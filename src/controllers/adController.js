const asyncHandler = require("express-async-handler");
const Ad = require("../models/Ad.js");

// @ post
// @ route /ads
const recordAd = asyncHandler(async (req, res) => {
  const { title, description, price } = req.body;
  if (!title || !description || !price) {
    res.status(400);
    throw new Error("Please fill out all fields");
  }
  const ad = await Ad.create({
    title,
    description,
    price,
    user: req.user.id,
  });
  res.status(200).json(ad);
});

module.exports = { recordAd };
