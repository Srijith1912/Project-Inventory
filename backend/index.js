const express = require ('express');
const mongoose = require('mongoose');
const cors = require('cors');
require("dotenv").config();

const itemRoutes = require("./routes/itemRoutes");
const checkoutRoutes = require("./routes/checkoutRoutes");
const { ensureDefaultItems } = require("./seed/defaultItems");

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000' }));
app.use(express.json());

app.use("/inventory", itemRoutes);
app.use("/checkout", checkoutRoutes);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB connected");
    await ensureDefaultItems();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error("MongoDB connection error", err));
