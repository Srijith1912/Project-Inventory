const Item = require('../models/Item');
const Order = require('../models/Order');

const checkout = async (req, res) => {

  const {items} = req.body;

  if (!Array.isArray(items) || items.length === 0){
    return res.status(400).json({error: "No items provided"})
  }

  const session = await Item.startSession();
  session.startTransaction();

  try{
    let total = 0;
    const receipt = [];

    for (const {id, quantity} of items){

      const item = await Item.findById(id).session(session);
      if(!item) throw new Error(`Item ${id} not found`);
      if(item.quantity < quantity){
        throw new Error(`Not enough stock for ${item.name}`);
      }

      item.quantity -= quantity;
      await item.save({session});

      const lineTotal = item.price * quantity;
      total += lineTotal;
      receipt.push({
        name: item.name,
        price: item.price,
        quantity,
        lineTotal
      });
    }

    await Order.create([{ items: receipt, total }], { session });
    await session.commitTransaction();
    res.json({message: "Checkout successful", total, receipt});
  }

  catch(err){
    await session.abortTransaction();
    res.status(400).json({error: err.message});
  }
  finally{
    session.endSession();
  }
};

const orderHistory = async(req, res) => {
  try{
    const orders = await Order.find().sort({createdAt: -1});
    res.json(orders);
  }
  catch(err){
    res.status(500).json({error: err.message});
  }
};

module.exports = {checkout, orderHistory};