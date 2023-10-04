require("express-async-errors");
const express = require("express");
const config = require("config");
const mongoose = require("mongoose");
const cookie = require("cookie-parser");
const cors = require("cors");

const orgRoute = require("./routes/organisations");
const managerRoute = require("./routes/managers");
const empRoute = require("./routes/employees");
const expRoute = require("./routes/expenses");
const assetRoute = require("./routes/assets");
const authRoute = require("./routes/auth");
const miniRoute = require("./routes/mini");

const error = require("./middlewares/error");

if (!config.get("jwtPrivateKey")) {
  console.log("FATAL ERROR: jwtPrivateKey not provided...");
  process.exit(1);
}

mongoose
  .connect(config.get("uri"))
  .then(() => console.log("Connected to Database"))
  .catch((err) => console.log(err));

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookie());

const corsOptions = {
  origin: "https://expense-tracker-client-theta.vercel.app",
  methods: "GET,POST,PUT,PATCH,DELETE",
  allowedHeaders: "Content-Type,Authorization",
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use("/api/org", orgRoute);
app.use("/api/mng", managerRoute);
app.use("/api/emp", empRoute);
app.use("/api/exp", expRoute);
app.use("/api/asset", assetRoute);
app.use("/api/dash", miniRoute);
app.use("/api/auth", authRoute);

app.use(error);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Server started..."));
