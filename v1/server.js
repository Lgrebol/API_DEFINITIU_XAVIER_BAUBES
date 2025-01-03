const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");
const config = require("./config");

const app = express();
const accessLogStream = fs.createWriteStream(path.join(__dirname, "server.log"), { flags: "a" });

// Middleware
app.use(express.json());

// Configured CORS to allow only specific origins
const corsOptions = {
  origin: ["http://specific-domain.com", "http://another-domain.com"], // Replace with allowed domains
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(morgan("combined", { stream: accessLogStream }));

// Routes
app.use("/api/v1/books", require("./routes/bookRoutes"));
app.use("/api/v1/auth", require("./routes/authRoutes"));
app.use("/api/v1/bookstores", require("./routes/bookstoreRoutes"));
app.use("/api/v1/sales", require("./routes/saleRoutes"));

// Server
app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});
