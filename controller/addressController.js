const { request } = require("express");
const Cart = require("../model/cartModel");
const Product = require("../model/productsModel");
const User = require("../model/userModel");
const Address = require("../model/addressModel");

const address = async (req, res) => {
  try {
    const id = req.session.user_id;
    const userData = await User.findById(id);
    const address = await Address.findOne({ user: id }).sort({ _id: -1 });

    res.render("address", { user: userData, address: address?.address || [] ,pageName:"Address"});
  } catch (error) {
    res.render("500");
  }
};
const addnewaddress = async (req, res) => {
  try {
    const user_id = req.session.user_id;

    // Check if the user already has an address
    const existingAddress = await Address.findOne({ user: user_id });

    if (existingAddress) {
      // Push the new address into the existing array
      const newAddress = {
        fullname: req.body.fullname,
        mobile: req.body.mobile,
        address: req.body.address,
        locality: req.body.locality,
        zipcode: req.body.zipcode,
        city: req.body.city,
        state: req.body.state,
      };
      existingAddress.address.push(newAddress);
      const updatedAddress = await existingAddress.save();
    } else {
      // Create a new address
      const newAddress = new Address({
        user: user_id,
        address: [
          {
            fullname: req.body.fullname,
            mobile: req.body.mobile,
            address: req.body.address,
            locality: req.body.locality,
            zipcode: req.body.zipcode,
            city: req.body.city,
            state: req.body.state,
          },
        ],
      });
      const addedAddress = await newAddress.save();
    }
    res.json({ success: true });
    // Handle success or send a response to the client
  } catch (error) {
    res.render("500");
  }
};

const editaddress = async (req, res) => {
  try {
    const user_id = req.session.user_id;
    const id = req.body.id;

    const existingAddress = await Address.findOne({
      user: user_id,
      "address._id": id,
    });

    if (existingAddress) {
      // Find the address to update based on the _id field
      const addressToUpdate = existingAddress.address.find(
        (addr) => addr._id.toString() === id
      );

      if (addressToUpdate) {
        // Update the specific address in the existing array
        addressToUpdate.fullname = req.body.fullname;
        addressToUpdate.mobile = req.body.mobile;
        addressToUpdate.address = req.body.address;
        addressToUpdate.locality = req.body.locality;
        addressToUpdate.zipcode = req.body.zipcode;
        addressToUpdate.city = req.body.city;
        addressToUpdate.state = req.body.state;

        // Save the updated document
        const updatedAddress = await existingAddress.save();
      } else {
      }
    }
    res.json({ success: true });
  } catch (error) {
    // Handle errors appropriately
    res.render("500");
  }
};

const deleteaddress = async (req, res) => {
  try {
    const user_id = req.session.user_id;
    const addressid = req.query.pos;

    const addressDocument = await Address.findOne({ user: user_id });
    addressDocument.address.pull({ _id: addressid });
    await addressDocument.save();

    res.redirect("/address");
  } catch (error) {
    res.render('500');
  }
};

module.exports = {
  address,
  addnewaddress,
  deleteaddress,
  editaddress,
};
