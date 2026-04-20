const express = require('express');
const router = express.Router();
const {getItems, createItem, updateItem, deleteItem} = require("../controllers/itemController");
const requireAdmin = require("../middleware/adminAuth");

router.get("/", getItems);
router.post("/", requireAdmin, createItem);
router.patch("/:id", requireAdmin, updateItem);
router.delete("/:id", requireAdmin, deleteItem);

module.exports = router;
