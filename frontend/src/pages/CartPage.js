import Cart from "../components/Cart";
import Checkout from "../components/Checkout";
import "./CartPage.css";

function CartPage({ cartItems, setCartItems }) {
  const updateQuantity = (id, quantity) => {
    if (!quantity || quantity < 1) return;
    setCartItems((prev) =>
      prev.map((item) => (item._id === id ? { ...item, quantity } : item))
    );
  };

  const removeItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item._id !== id));
  };

  const clearCart = () => setCartItems([]);

  return (
    <section className="cart-page page-container">
      <h1 className="page-title">Your Cart</h1>

      <div className="cart-layout">
        <div className="cart-col">
          <Cart
            cartItems={cartItems}
            updateQuantity={updateQuantity}
            removeItem={removeItem}
          />
        </div>
        <div className="cart-col cart-col-side">
          <Checkout cartItems={cartItems} clearCart={clearCart} />
        </div>
      </div>
    </section>
  );
}

export default CartPage;
