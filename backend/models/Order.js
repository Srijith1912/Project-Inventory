const mongoose = require ('mongoose');

const orderSchema = new mongoose.Schema({
  items: [{
    name: String, 
    price: Number,
    quantity: Number,
    lineTotal: Number
  }],
  total: Number,
  createdAt: {type: Date, default: Date.now}
});

module.exports = mongoose.model("Order", orderSchema);

