import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ItemList from "./components/ItemList";
import AdminInventoryPage from "./pages/AdminInventoryPage";
import OrderHistory from "./components/OrderHistory";
import CartPage from "./pages/CartPage";
import "./App.css";

function App() {
  const [cartItems, setCartItems] = useState([]);

  const handleAddToCart = (itemToAdd) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item._id === itemToAdd._id);
      if (existing) {
        return prev.map((item) =>
          item._id === itemToAdd._id
            ? { ...item, quantity: item.quantity + itemToAdd.quantity }
            : item
        );
      }
      return [...prev, itemToAdd];
    });
  };

  return (
    <div class="body">
      <Router>
        <nav class="links">
          <Link to="/admin">Admin</Link><Link to="/">Inventory</Link>  
          <Link to="/cart">Cart</Link> <Link to="/orders">Orders</Link>
        </nav>
        <Routes>
          <Route
            path="/"
            element={<ItemList onAddToCart={handleAddToCart} />}
          />
          <Route path="/admin" element={<AdminInventoryPage />} />
          <Route
            path="/cart"
            element={
              <CartPage cartItems={cartItems} setCartItems={setCartItems} />
            }
          />
          <Route path="/orders" element={<OrderHistory />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
