import { Link } from "react-router-dom";
import "./styles/Cart.css";

function Cart({ cartItems, updateQuantity, removeItem }) {
  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (cartItems.length === 0) {
    return (
      <div className="card cart-empty">
        <h2 className="cart-heading">Your cart is empty</h2>
        <p className="cart-empty-text">
          Looks like you haven't added anything yet.
        </p>
        <Link to="/" className="btn btn-primary">
          Browse items
        </Link>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 className="cart-heading">Items ({cartItems.length})</h2>
      <ul className="cart-list">
        {cartItems.map((item) => (
          <li key={item._id} className="cart-item">
            <div className="cart-item-info">
              <div className="cart-item-name">{item.name}</div>
              <div className="cart-item-price">${item.price} each</div>
            </div>
            <div className="cart-item-controls">
              <input
                className="input cart-qty"
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) =>
                  updateQuantity(item._id, parseInt(e.target.value))
                }
              />
              <div className="cart-item-line">
                ${(item.price * item.quantity).toFixed(2)}
              </div>
              <button
                className="btn btn-ghost btn-sm cart-remove"
                onClick={() => removeItem(item._id)}
                aria-label={`Remove ${item.name}`}
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>
      <div className="cart-footer">
        <span>Subtotal</span>
        <strong>${total.toFixed(2)}</strong>
      </div>
    </div>
  );
}

export default Cart;
