const Banner = require("../model/bannerModel");

const loadBanner = async (req, res) => {
  try {
    res.render("banners", { pageName: "Banners" });
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  loadBanner,
};
