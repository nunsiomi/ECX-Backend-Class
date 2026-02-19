require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth.routes");
const { errorHandler } = require("./middleware/error.middleware");
const meRoutes = require("./routes/me.routes");
const eventRoutes = require("./routes/event.routes");
const bookingRoutes = require("./routes/booking.routes");
const swaggerUi = require("swagger-ui-express");
const { swaggerSpec } = require("./swagger");
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Event Booking API is running" });
});

app.use("/auth", authRoutes);

app.use("/", meRoutes);

app.use("/events", eventRoutes);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/docs.json", (req, res) => res.json(swaggerSpec));

// centralized error handler (must be last)
app.use(errorHandler);

app.use("/bookings", bookingRoutes);

module.exports = app;
