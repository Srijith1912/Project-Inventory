import { useEffect, useState } from "react";
import api from "../api";
import "./styles/ItemList.css"

function ItemList({ onAddToCart }) {
  const [items, setItems] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/inventory")
      .then((res) => setItems(res.data))
      .catch((err) => setError(err.response?.data?.error || err.message));
  }, []);

  const handleQuantityChange = (id, value) => {
    setQuantities((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <div class="body1">
      <h2>Inventory</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {items.map((item) => (
          <li key={item._id}>
            <div class="row">
            <pre><strong>{item.name}</strong> : <strong>${item.price}</strong> — <strong>{item.quantity}</strong> in stock</pre>
            <input class="input1"
              type="number"
              min="1"
              placeholder="Qty"
              value={quantities[item._id] || ""}
              onChange={(e) => handleQuantityChange(item._id, e.target.value)}
              style={{ width: "60px", marginLeft: "10px" }}
            />
            <button class="button1"
              onClick={() => {
                const qty = parseInt(quantities[item._id]);
                if (!qty || qty < 1) return alert("Enter valid quantity");
                onAddToCart({ ...item, quantity: qty });
                setQuantities((prev) => ({ ...prev, [item._id]: "" }));
                
              }}
            >
              Add to Cart
            </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ItemList;
