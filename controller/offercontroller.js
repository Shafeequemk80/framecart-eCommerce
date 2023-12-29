const Offer = require("../model/offerModel");
const Category = require("../model/categoryModel");
const Products = require("../model/productsModel");

const getoffers = async (req, res) => {
  try {
    var search = "";

    if (req.query.search) {
      search = req.query.search;
    }

    var page = 1;
    if (req.query.page) {
      page = req.query.page;
    }

    var limit = 5;

    const offerData = await Offer.find({
      offername: { $regex: ".*" + search + ".*", $options: "i" },
    })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Offer.find({
      offername: { $regex: ".*" + search + ".*", $options: "i" },
    }).countDocuments();

    res.render("offers", {
      offerData: offerData,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      previouspage: page - 1, // Corrected property name
      nextpage: parseInt(page) + 1,
      search: search,
    });
  } catch (error) {
    res.render("500");
  }
};

const addoffers = async (req, res) => {
  try {
    res.render("addoffers");
  } catch (error) {
    res.render("500");
  }
};

const saveoffers = async (req, res) => {
  try {
    const offername = req.body.offername;
    const createdAt = req.body.createdAt;
    const updatedAt = req.body.updatedAt;
    const percentage = req.body.percentage;

    const updateData = new Offer({
      offername: offername,
      createdAt: createdAt,
      expiryDate: updatedAt, // Fix potential typo here
      percentage: percentage,
      action: 1,
    });

    const updated = await updateData.save();
    res.json({ success: true });
  } catch (error) {
    res.render("500");
  }
};

const unlistoffers = async (req, res) => {
  try {
    const action = req.body.action;
    const offerId = req.body.offerId;

    const offerData = await Offer.findOne({ _id: offerId });

    if (!offerData) {
      return res.status(404).json({ message: "Offer not found" });
    } else offerData.action = action;

    const unlisted = await offerData.save();
    if (unlisted) {
      res.json({ success: true });
    } else {
      res.json({ success: flase });
    }
  } catch (error) {
    res.render("500");
  }
};

const edittoffers = async (req, res) => {
  try {
    const offerId = req.query.id;

    const offerData = await Offer.findOne({ _id: offerId });
    res.render("editoffers", { offerData: offerData });
  } catch (error) {
    res.render("500");
  }
};
const updateOffers = async (req, res) => {
  try {
    const offerData = await Offer.findOne({ _id: req.body.id });

    if (offerData) {
      // Assuming req.body.createdAt and req.body.updatedAt are in the "mm/dd/yyyy" format
      const createdAtDate = new Date(req.body.createdAt);
      const updatedAtDate = new Date(req.body.updatedAt);

      offerData.offername = req.body.offername;
      offerData.createdAt = createdAtDate;
      offerData.expiryDate = updatedAtDate;
      offerData.percentage = req.body.percentage;

      await offerData.save();
    }

    res.status(200).json({ success: true });
  } catch (error) {
    res.render("500");
  }
};

const applyoffercategory = async (req, res) => {
  try {
    const offerId = req.body.offerId;
    const category_id = req.body.category_id;

    const offerData = await Offer.findOne({ _id: offerId });

    const categoryData = await Category.findOne({ _id: category_id });

    if (offerData && categoryData) {
      categoryData.offer = offerData._id;

      const productData = await Products.find({
        frameshape: categoryData.categoryname,
      });

      // Update discount prices for products in the category
      for (const product of productData) {
        if (product.offer == null) {
          product.discountprice =
            product.price - (offerData.percentage * product.price) / 100;
          await product.save(); // Save the first product that matches the condition
        }
      }
      // Save the updated category data
      const updatedCategory = await categoryData.save();

      if (updatedCategory) {
        // Respond with a success status
        res.status(200).json({ success: true });
      } else {
        // Respond with an error status if the save operation fails
        res
          .status(500)
          .json({ success: false, message: "Failed to update category" });
      }
    } else {
      // Respond with an error status if either offer or category data is not found
      res
        .status(404)
        .json({ success: false, message: "Offer or category not found" });
    }
  } catch (error) {
    res.render("500");
  }
};
const removeOfferCategories = async (req, res) => {
  try {
    const categoryId = req.body.category_id;

    const categoryData = await Category.findById(categoryId).populate("offer");
    const productData = await Products.find({
      frameshape: categoryData.categoryname,
    }).populate("offer");

    for (const product of productData) {
      if (product.offer === null) {
        product.discountprice = null;
      } else if (product.offer && product.offer.percentage) {
        product.discountprice =
          product.price - (product.offer.percentage * product.price) / 100;
      }

      await product.save();
    }

    if (categoryData) {
      categoryData.offer = null;
      const updateData = await categoryData.save();

      if (updateData) {
        res.status(200).json({ success: true });
      }
    }
  } catch (error) {
    res.render("500");
  }
};

const applyOfferProduct = async (req, res) => {
  try {
    const offerId = req.body.offerId;
    const product_id = req.body.product_id;

    const offerData = await Offer.findOne({ _id: offerId });

    const productData = await Products.findOne({ _id: product_id }).populate(
      "offer"
    );

    const categoryData = await Category.findOne({
      categoryname: productData.frameshape,
    }).populate("offer");

    if (categoryData.offer == null) {
      productData.offer = offerId;
      productData.discountprice =
        productData.price - (offerData.percentage * productData.price) / 100;
    } else {
      // Check if the new offer has a higher percentage
      if (categoryData.offer.percentage < offerData.percentage) {
        productData.offer = offerData._id;
        productData.discountprice =
          productData.price - (offerData.percentage * productData.price) / 100;
      } else {
        // Respond with a message indicating that the offer was not added
        res.json({ notAdded: true, message: "Offer percentage not higher" });
        return; // Stop further execution
      }
    }

    const updatedProduct = await productData.save();

    if (updatedProduct) {
      // Respond with a success status
      res.status(200).json({ success: true });
    } else {
      // Respond with an error status if the save operation fails
      res
        .status(500)
        .json({ success: false, message: "Failed to update product" });
    }
  } catch (error) {
    // Handle errors and respond with an appropriate message
    res.render("500");
  }
};
const removeOfferProduct = async (req, res) => {
  try {
    const productId = req.body.product_id;
    const productData = await Products.findById(productId);

    if (!productData) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" })
        .populate("offer");
    }

    const categoryData = await Category.findOne({
      categoryname: productData.frameshape,
    }).populate("offer");

    if (categoryData.offer === null) {
      productData.offer = null;
      productData.discountprice = null;
    } else {
      productData.offer = null;
      productData.discountprice =
        productData.price -
        (categoryData.offer.percentage * productData.price) / 100;
    }

    const updatedProduct = await productData.save();

    return res.status(200).json({ success: true });
  } catch (error) {
    res.render("500");
  }
};

module.exports = {
  getoffers,
  addoffers,
  saveoffers,
  unlistoffers,
  edittoffers,
  updateOffers,
  applyoffercategory,
  removeOfferCategories,
  applyOfferProduct,
  removeOfferProduct,
};
