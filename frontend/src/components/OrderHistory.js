import { useEffect, useState } from "react";
import api from "../api";

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/checkout/history")
      .then((res) => setOrders(res.data))
      .catch((err) => setError(err.response?.data?.error || err.message));
  }, []);

  return (
    <div>
      <h2>Order History</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {orders.length === 0 ? (
        <p>No past orders found.</p>
      ) : (
        orders.map((order, index) => (
          <div
            key={index}
            style={{
              border: "2px solid black",
              marginBottom: "1em",
              padding: "1em",
            }}
          >
            <h4>Order #{index + 1}</h4>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(order.createdAt).toLocaleString()}
            </p>
            <ul>
              {order.items.map((item, i) => (
                <li key={i}>
                  {item.name} — {item.quantity} × ${item.price} = $
                  {item.lineTotal}
                </li>
              ))}
            </ul>
            <strong>Total: ${order.total}</strong>
          </div>
        ))
      )}
    </div>
  );
}

export default OrderHistory;
