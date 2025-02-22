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
// @ update
const updateAd = asyncHandler(async (req, res) => {

  const { title, description, price, link } = req.body;

  const ad = await Ad.findById(req.params.id);

  if (ad.user.toString() !== req.user.id && req.user.role !== 'admin') {
        res.status(401);
        throw new Error("User not authorized");
    }

  if (!title || !description || !price || !link) {
    res.status(400);
    throw new Error("Please fill out all fields");
  }
  const updatedAd = await Ad.findByIdAndUpdate(
    req.params.id,
    {
      title,
      description,
      price,
      link
    },
    {new:true}
  );
  res.status(200).json(updatedAd);
});
// @ delete /ads/:id
const deleteAd = asyncHandler(async(req,res)=>{
  const ad = await Ad.findByIdAndDelete(req.params.id)
  res.status(200).json(ad)
})
module.exports = { recordAd, getAd,updateAd,deleteAd };
