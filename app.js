const express = require("express");
const app = express();
app.use(express.json());
require("dotenv").config();
const connectingDB = require("./config/db.js");
const { errorHandler } = require("./middleware/errorHandler.js");
const cors = require("cors");
connectingDB();
app.use(cors());
app.options("*", cors());
app.use(express.urlencoded({ extended: false }));

app.use("/users", require("./routes/userRoutes.js"));
app.use(errorHandler);
app.use("/ads", require("./routes/adRoutes.js"));

const PORT = process.env.PORT || 999;
app.listen(PORT, () => console.log(`server is UP on port: ${PORT}`));
