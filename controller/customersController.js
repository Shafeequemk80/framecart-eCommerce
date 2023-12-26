const User = require("../model/userModel");

const suspenduser = async (req, res) => {
  try {
    const id = req.query.id;

    const suspend = await User.updateOne(
      { _id: id },
      { $set: { is_Verified: 0 } }
    );

    res.redirect("/admin/customers");
  } catch (error) {
    res.render("500");
  }
};

const activeuser = async (req, res) => {
  try {
    const id = req.query.id;

    const suspend = await User.updateOne(
      { _id: id },
      { $set: { is_Verified: 1 } }
    );

    res.redirect("/admin/customers");
  } catch (error) {
    res.render("500");
  }
};

module.exports = {
  suspenduser,
  activeuser,
};
