import { useState } from "react";
import api from "../api";
import "./styles/Cart.css"

function Checkout({ cartItems, clearCart }) {
  const [receipt, setReceipt] = useState(null);
  const [error, setError] = useState("");

  const handleCheckout = async () => {
    setError("");
    if (cartItems.length === 0) {
      return setError("Cart is empty");
    }

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
    }
  };

  return (
    <div>

      <h2>Checkout</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {receipt && (
        <div>
          <h3>Receipt</h3>
          <ul>
            {receipt.receipt.map((item, index) => (
              <li key={index}>
                {item.name} — {item.quantity} × ${item.price} = $
                {item.lineTotal}
              </li>
            ))}
          </ul>
          <h4>Total: ${receipt.total}</h4>
        </div>
      )}
      <button onClick={handleCheckout} class="confirm">
        Confirm Purchase
      </button>
    </div>
  );
}

export default Checkout;
