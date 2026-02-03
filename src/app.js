const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/user.routes");

const app = express();

// Middlewares
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use("/api/users", userRoutes);

// Routes
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

module.exports = app;
