const Item = require("../models/Item");

const defaultItems = [
  // Fruits (10)
  { name: "Apple", type: "Fruit", price: 1.29, quantity: 80 },
  { name: "Banana", type: "Fruit", price: 0.59, quantity: 120 },
  { name: "Orange", type: "Fruit", price: 0.99, quantity: 90 },
  { name: "Mango", type: "Fruit", price: 2.49, quantity: 50 },
  { name: "Grapes", type: "Fruit", price: 3.49, quantity: 60 },
  { name: "Strawberry", type: "Fruit", price: 4.99, quantity: 40 },
  { name: "Watermelon", type: "Fruit", price: 5.99, quantity: 25 },
  { name: "Pineapple", type: "Fruit", price: 3.99, quantity: 30 },
  { name: "Blueberry", type: "Fruit", price: 4.49, quantity: 45 },
  { name: "Kiwi", type: "Fruit", price: 0.89, quantity: 70 },

  // Vegetables (10)
  { name: "Tomato", type: "Vegetable", price: 1.19, quantity: 100 },
  { name: "Carrot", type: "Vegetable", price: 0.79, quantity: 110 },
  { name: "Potato", type: "Vegetable", price: 0.49, quantity: 150 },
  { name: "Onion", type: "Vegetable", price: 0.69, quantity: 140 },
  { name: "Spinach", type: "Vegetable", price: 2.29, quantity: 55 },
  { name: "Broccoli", type: "Vegetable", price: 1.99, quantity: 70 },
  { name: "Cucumber", type: "Vegetable", price: 0.99, quantity: 85 },
  { name: "Bell Pepper", type: "Vegetable", price: 1.49, quantity: 75 },
  { name: "Lettuce", type: "Vegetable", price: 1.79, quantity: 65 },
  { name: "Cauliflower", type: "Vegetable", price: 2.49, quantity: 40 },

  // Grains & Staples (10)
  { name: "White Rice", type: "Grain", price: 8.99, quantity: 60 },
  { name: "Brown Rice", type: "Grain", price: 9.99, quantity: 45 },
  { name: "Pasta", type: "Grain", price: 2.49, quantity: 100 },
  { name: "Spaghetti", type: "Grain", price: 2.29, quantity: 90 },
  { name: "Quinoa", type: "Grain", price: 6.99, quantity: 35 },
  { name: "Oats", type: "Grain", price: 4.49, quantity: 70 },
  { name: "Whole Wheat Bread", type: "Grain", price: 3.29, quantity: 50 },
  { name: "All-Purpose Flour", type: "Grain", price: 3.99, quantity: 65 },
  { name: "Cornmeal", type: "Grain", price: 3.49, quantity: 40 },
  { name: "Couscous", type: "Grain", price: 4.99, quantity: 30 },

  // Dairy & Eggs (5)
  { name: "Whole Milk", type: "Dairy", price: 3.79, quantity: 80 },
  { name: "Butter", type: "Dairy", price: 4.49, quantity: 60 },
  { name: "Cheddar Cheese", type: "Dairy", price: 5.99, quantity: 45 },
  { name: "Greek Yogurt", type: "Dairy", price: 4.29, quantity: 70 },
  { name: "Eggs (dozen)", type: "Dairy", price: 3.49, quantity: 100 },

  // Beverages (5)
  { name: "Ground Coffee", type: "Beverage", price: 9.99, quantity: 50 },
  { name: "Green Tea", type: "Beverage", price: 5.49, quantity: 65 },
  { name: "Orange Juice", type: "Beverage", price: 4.29, quantity: 55 },
  { name: "Cola (6-pack)", type: "Beverage", price: 5.99, quantity: 70 },
  { name: "Bottled Water (12-pk)", type: "Beverage", price: 3.99, quantity: 120 },

  // Snacks (5)
  { name: "Potato Chips", type: "Snack", price: 3.49, quantity: 85 },
  { name: "Chocolate Cookies", type: "Snack", price: 3.99, quantity: 60 },
  { name: "Dark Chocolate Bar", type: "Snack", price: 2.99, quantity: 75 },
  { name: "Popcorn", type: "Snack", price: 2.49, quantity: 90 },
  { name: "Granola Bars", type: "Snack", price: 4.99, quantity: 55 },

  // Electronics (5)
  { name: "USB-C Charger", type: "Electronics", price: 19.99, quantity: 35 },
  { name: "AA Batteries (8-pk)", type: "Electronics", price: 7.99, quantity: 60 },
  { name: "LED Light Bulb", type: "Electronics", price: 4.49, quantity: 80 },
  { name: "USB-C Cable", type: "Electronics", price: 9.99, quantity: 70 },
  { name: "Extension Cord", type: "Electronics", price: 14.99, quantity: 25 },
];

async function ensureDefaultItems() {
  try {
    const existing = await Item.find({}, { name: 1 }).lean();
    const existingNames = new Set(existing.map((i) => i.name));

    const missing = defaultItems.filter((d) => !existingNames.has(d.name));

    if (missing.length === 0) {
      console.log("All default items present — nothing to seed");
      return;
    }

    await Item.insertMany(missing);
    console.log(
      `Restored ${missing.length} missing default item${
        missing.length === 1 ? "" : "s"
      }`
    );
  } catch (err) {
    console.error("Seeding failed:", err.message);
  }
}

module.exports = { ensureDefaultItems, defaultItems };
