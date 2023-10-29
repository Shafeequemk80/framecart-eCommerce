const express = require("express");
const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/frmecart");
const app = express();
const path = require("path");
const user_route = require("./routes/userRoute");
const admin_route = require("./routes/adminRoute");
const bodyparser=require("body-parser");


app.use(bodyparser.urlencoded({extended:true}))
app.use(bodyparser.json());


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views/users"));

app.use("/static", express.static(path.join(__dirname, "./public")));

app.use("/", user_route);

app.use("/admin", admin_route);
const PORT =  3000;

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}/login`);
});
