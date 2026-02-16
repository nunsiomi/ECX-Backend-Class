require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth.routes");
const { errorHandler } = require("./middleware/error.middleware");
const meRoutes = require("./routes/me.routes");


const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Event Booking API is running" });
});

app.use("/auth", authRoutes);

app.use("/", meRoutes);

// centralized error handler (must be last)
app.use(errorHandler);

module.exports = app;
