require("dotenv").config();
const express = require("express");
const morgan = require("morgan");

const mongoose = require("mongoose");
// mongoose.connect("mongodb://127.0.0.1:27017/frmecart");
mongoose.connect("mongodb+srv://shafeequemk80:1L3SlbG4OC7wYevT@farado-db.t8xnvt4.mongodb.net/?retryWrites=true&w=majority");

const app = express();
const path = require("path");
const moment = require("moment");

const user_route = require("./routes/userRoute");
const admin_route = require("./routes/adminRoute");

const bodyparser = require("body-parser");
const nocache = require("nocache");
app.use(nocache());

app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());



app.use("/static", express.static(path.join(__dirname, "public")));
app.use("/", user_route);
app.use("/admin", admin_route);


app.use((req, res)=>{
  res.status(404).render(__dirname + '/views/users/404.ejs')
})

app.use(morgan("dev"));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}/`);
  console.log(`http://localhost:${PORT}/home`);
  console.log(`http://localhost:${PORT}/admin`);
});
