import Cart from "../components/Cart";
import Checkout from "../components/Checkout";

function CartPage({ cartItems, setCartItems }) {
  const updateQuantity = (id, quantity) => {
    setCartItems((prev) =>
      prev.map((item) => (item._id === id ? { ...item, quantity } : item))
    );
  };

  const removeItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item._id !== id));
  };

  const clearCart = () => setCartItems([]);

  return (
    <div class="container">
      <h1>Your Shopping Cart</h1>

      <Cart
        cartItems={cartItems}
        updateQuantity={updateQuantity}
        removeItem={removeItem}
      />

      <Checkout cartItems={cartItems} clearCart={clearCart} />
    </div>
  );
}

export default CartPage;
