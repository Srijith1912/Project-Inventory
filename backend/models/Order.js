const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  guestId: { type: String, required: true, index: true },
  items: [{
    name: String,
    price: Number,
    quantity: Number,
    lineTotal: Number
  }],
  total: Number,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", orderSchema);
