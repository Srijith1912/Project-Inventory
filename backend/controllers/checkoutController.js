const Item = require('../models/Item');
const Order = require('../models/Order');

const normalizeGuestId = (raw) => (raw || "").trim().toLowerCase();

const checkout = async (req, res) => {
  const { items } = req.body;
  const guestId = normalizeGuestId(req.header("x-guest-id"));

  if (!guestId) {
    return res
      .status(401)
      .json({ error: "Please sign in with a guest ID to place an order" });
  }

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "No items provided" });
  }

  const session = await Item.startSession();
  session.startTransaction();

  try {
    let total = 0;
    const receipt = [];

    for (const { id, quantity } of items) {
      const item = await Item.findById(id).session(session);
      if (!item) throw new Error(`Item ${id} not found`);
      if (item.quantity < quantity) {
        throw new Error(`Not enough stock for ${item.name}`);
      }

      item.quantity -= quantity;
      await item.save({ session });

      const lineTotal = item.price * quantity;
      total += lineTotal;
      receipt.push({
        name: item.name,
        price: item.price,
        quantity,
        lineTotal
      });
    }

    await Order.create([{ guestId, items: receipt, total }], { session });
    await session.commitTransaction();
    res.json({ message: "Checkout successful", total, receipt });
  } catch (err) {
    await session.abortTransaction();
    res.status(400).json({ error: err.message });
  } finally {
    session.endSession();
  }
};

const orderHistory = async (req, res) => {
  const guestId = normalizeGuestId(req.header("x-guest-id"));

  if (!guestId) {
    return res
      .status(401)
      .json({ error: "Sign in with a guest ID to view your orders" });
  }

  try {
    const orders = await Order.find({ guestId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { checkout, orderHistory };
