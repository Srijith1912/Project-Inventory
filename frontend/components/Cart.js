import "./styles/Cart.css"

function Cart({ cartItems, updateQuantity, removeItem }) {
  
  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div>
      <h2>Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <ul>
          {cartItems.map((item, index) => (
            <li key={item._id} class="li4">
              <span>{item.name} - ${item.price}</span>
              <input class="inputcart"
                type="number"
                value={item.quantity}
                min="1"
                onChange={(e) =>
                  updateQuantity(item._id, parseInt(e.target.value))
                }
              />
              = ${(item.price * item.quantity).toFixed(2)}
              <button class="cartdel" onClick={() => removeItem(item._id)}>Remove</button>
            </li>
          ))}
        </ul>
      )}
      <h3>Total: ${total.toFixed(2)}</h3>
    </div>
  );
}
export default Cart;
