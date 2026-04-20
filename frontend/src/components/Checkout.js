import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { useGuest } from "../context/GuestContext";
import "./styles/Checkout.css";

function Checkout({ cartItems, clearCart }) {
  const { isSignedIn, guestId } = useGuest();
  const [receipt, setReceipt] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleCheckout = async () => {
    setError("");
    if (!isSignedIn) {
      setError("Please sign in with a guest ID to place an order");
      return;
    }
    if (cartItems.length === 0) return setError("Cart is empty");

    setLoading(true);
    try {
      const formattedItems = cartItems.map((item) => ({
        id: item._id || item.id,
        quantity: item.quantity,
      }));

      const res = await api.post("/checkout", { items: formattedItems });
      setReceipt(res.data);
      clearCart();
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  if (receipt) {
    return (
      <div className="card receipt">
        <div className="receipt-header">
          <div className="receipt-check">✓</div>
          <h2 className="receipt-title">Order confirmed</h2>
          <p className="receipt-subtitle">Thanks for shopping with PantryPro.</p>
        </div>
        <ul className="receipt-list">
          {receipt.receipt.map((item, index) => (
            <li key={index} className="receipt-line">
              <div>
                <div className="receipt-name">{item.name}</div>
                <div className="receipt-meta">
                  {item.quantity} × ${item.price}
                </div>
              </div>
              <div className="receipt-amount">${item.lineTotal}</div>
            </li>
          ))}
        </ul>
        <div className="receipt-total">
          <span>Total</span>
          <strong>${receipt.total}</strong>
        </div>
        <button
          className="btn btn-ghost receipt-new"
          onClick={() => setReceipt(null)}
        >
          Place another order
        </button>
      </div>
    );
  }

  return (
    <div className="card checkout">
      <h2 className="checkout-title">Order summary</h2>

      <div className="checkout-line">
        <span>Items</span>
        <span>{cartItems.reduce((n, i) => n + i.quantity, 0)}</span>
      </div>
      <div className="checkout-line">
        <span>Subtotal</span>
        <span>${subtotal.toFixed(2)}</span>
      </div>
      <div className="checkout-line checkout-total">
        <span>Total</span>
        <strong>${subtotal.toFixed(2)}</strong>
      </div>

      {!isSignedIn && (
        <div className="checkout-signin-hint">
          <div className="checkout-signin-text">
            Sign in with a guest ID to place an order.
          </div>
          <Link to="/signin" className="btn btn-ghost btn-sm">
            Sign in
          </Link>
        </div>
      )}

      {isSignedIn && (
        <div className="checkout-signed">
          Placing order as <strong>{guestId}</strong>
        </div>
      )}

      {error && <div className="alert-error">{error}</div>}

      <button
        onClick={handleCheckout}
        className="btn btn-primary checkout-btn"
        disabled={loading || cartItems.length === 0 || !isSignedIn}
      >
        {loading ? "Processing..." : "Confirm Purchase"}
      </button>
      <p className="checkout-note">
        Your orders are saved under your guest ID.
      </p>
    </div>
  );
}

export default Checkout;
