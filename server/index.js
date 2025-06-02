const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const conversationRoutes = require("./routes/conversationRoutes");
const connectDB = require("./config/db");
const { port } = require("./config/keys");

const app = express();
app.use(express.json());
app.use(cors());

dotenv.config();

connectDB();

app.use("/api/conversations", conversationRoutes);

app.listen(port, () => console.log("Server is running on port " + port));