const Item = require('../models/Item');

const getItems = async (req, res) => {

  try{
    const items = await Item.find();
    res.json(items);
  }
  catch(err){
    res.status(500).json({error: err.message});
  }
};

const createItem = async (req, res) => {

  const {name, type, price, quantity} = req.body;

  try{
    const newItem = new Item({name, type, price, quantity});
    await newItem.save();
    res.status(201).json(newItem);
  }
  catch(err){
    res.status(400).json({error: err.message});
  }
};

const updateItem = async (req, res) => {
  const {id} = req.params;
  const updates = req.body;

  try{
    const updated = await Item.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true
    });
    if (!updated) return res.status(404).json({error: "Item not found"});
    res.json(updated);
  }
  catch(err){
    res.status(400).json({error: err.message})
  }
}

const deleteItem = async (req, res) =>{

  const {id} = req.params;

  try{
    const deleted = await Item.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({error: "Item not found"});
    res.json({message: "Item deleted", id});
  }
  catch(err){
    res.status(400).json({error: err.message});
  }
}

module.exports = {getItems, createItem, updateItem, deleteItem};
