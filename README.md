# 🛒 Grocery Inventory Manager – MERN Stack Project #

A full-stack MERN application designed to help small-scale grocery shop owners manage inventory, track stock, and allow customers to checkout items through a simple interface.

---

## 📌 Project Overview

| Feature | Description |
|--------|-------------|
| Inventory Management | Create, update, and delete items |
| Cart + Checkout | Add items to cart, purchase, and auto-deduct stock |
| User Interfaces | Separate views for customer and shop owner (planned) |
| Tech Stack | MongoDB, Express, React, Node.js, TailwindCSS |

---

## 📅 Daily Progress Log

### ✅ **Day 1** – Backend Setup & Checkout System
- Initialized backend project using Node.js and Express
- Connected to MongoDB Atlas with Mongoose
- Created `Item` model (name, type, price, quantity)
- Built RESTful routes:  
  - `GET /inventory`  
  - `POST /inventory`  
  - `PATCH /inventory/:id`  
  - `DELETE /inventory/:id`

- Created `/checkout` POST endpoint
- Implemented quantity deduction for multiple items
- Used Mongoose sessions + transactions for rollback safety
- Included receipt + total price in checkout response
- Documented routes and session behavior

----

## 🔧 Setup Instructions

### Backend Setup
1. Navigate to `/backend` folder:
2. Create a `.env` file:
   ```env
   MONGO_URI=your_mongodb_connection_string
   PORT=5000
