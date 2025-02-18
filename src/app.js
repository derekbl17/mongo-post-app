const express = require("express");
const cors = require("cors");
require("dotenv").config();
//
const { errorHandler } = require("./middleware/errorHandler.js");
//
const connectingDB = require("./config/db.js");
//
connectingDB();
const app = express();
//
app.use(cors());
app.options("*", cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
//
app.use("/ads", require("./routes/adRoutes.js"));
app.use("/users", require("./routes/userRoutes.js"));
//
app.use(errorHandler);

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});

module.exports = app
// const PORT = process.env.PORT || 999;
// app.listen(PORT, () => console.log(`server is UP on port: ${PORT}`));
