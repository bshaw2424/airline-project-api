const express = require("express");
const app = express();
const cors = require("cors");
const airlineRoutes = require("./routes/airlines");
const destinationRoutes = require("./routes/destinations");
require("./databaseConnection");
const PORT = process.env.port || 8080;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/airlines", airlineRoutes);
app.use("/airlines/info", airlineRoutes);
app.use("/airlines/:slug/destinations", destinationRoutes);

app.listen(PORT, () => console.log(`server running on port ${PORT}`));
