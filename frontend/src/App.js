import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import ItemList from "./components/ItemList";
import AdminInventoryPage from "./pages/AdminInventoryPage";
import OrderHistory from "./components/OrderHistory";
import CartPage from "./pages/CartPage";
import Header from "./components/Header";
import AdminLogin from "./components/AdminLogin";
import GuestSignIn from "./components/GuestSignIn";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { GuestProvider, useGuest } from "./context/GuestContext";
import "./App.css";

function AdminRoute() {
  const { isAdmin } = useAuth();
  return isAdmin ? <AdminInventoryPage /> : <AdminLogin />;
}

function GuestGate({ title, subtitle, children }) {
  const { isSignedIn } = useGuest();
  return isSignedIn ? (
    children
  ) : (
    <GuestSignIn title={title} subtitle={subtitle} />
  );
}

function SignInRoute() {
  const { isSignedIn } = useGuest();
  if (isSignedIn) return <Navigate to="/" replace />;
  return (
    <GuestSignIn
      title="Sign in as guest"
      subtitle="Pick any ID to keep your orders separate. No password required."
    />
  );
}

function AppShell() {
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

  const cartCount = cartItems.reduce((n, item) => n + item.quantity, 0);

  return (
    <div className="app">
      <Header cartCount={cartCount} />
      <main className="app-main">
        <Routes>
          <Route
            path="/"
            element={<ItemList onAddToCart={handleAddToCart} />}
          />
          <Route path="/admin" element={<AdminRoute />} />
          <Route
            path="/cart"
            element={
              <CartPage cartItems={cartItems} setCartItems={setCartItems} />
            }
          />
          <Route
            path="/orders"
            element={
              <GuestGate
                title="Sign in to view orders"
                subtitle="Enter your guest ID to see your order history. Use the same ID on any device to find the same orders."
              >
                <OrderHistory />
              </GuestGate>
            }
          />
          <Route path="/signin" element={<SignInRoute />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <GuestProvider>
          <AppShell />
        </GuestProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
