const islogin = async (req, res, next) => {
  try {
    if (req.session.admin_id) {
      next();
    } else {
      res.redirect("/admin");
    }
  } catch (error) {
res.render("admin/500")
  }
};

const isLogout = async (req, res, next) => {
  try {
    if (req.session.admin_id) {
      res.redirect("/admin/dashboard");
    } else {
      next();
    }
  } catch (error) {
    res.render("admin/500")
  }
};
module.exports={
    islogin,
    isLogout
}