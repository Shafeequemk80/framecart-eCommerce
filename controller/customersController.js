const User = require("../model/userModel");

const suspend = async (req, res) => {
  try {
    const id = req.query.id;
    console.log(id);
    const suspend = await User.updateOne(
      { _id: id },
      { $set: { is_Verified: 0 } }
    );
    
    console.log(suspend);
    res.redirect("/admin/customers");
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const active = async (req, res) => {
    try {
      const id = req.query.id;
      console.log(id);
      const suspend = await User.updateOne(
        { _id: id },
        { $set: { is_Verified: 1 } }
      );
      
      console.log(suspend);
      res.redirect("/admin/customers");
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  

module.exports = {
  suspend,
  active
};
