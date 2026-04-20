import { useEffect, useState } from "react";
import api from "../api";
import "./styles/OrderHistory.css";

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/checkout/history")
      .then((res) => setOrders(res.data))
      .catch((err) => setError(err.response?.data?.error || err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="orders page-container">
      <h1 className="page-title">Order History</h1>
      <p className="page-subtitle">
        All previous orders placed through PantryPro.
      </p>

      {error && <div className="alert-error">{error}</div>}

      {loading ? (
        <div className="card empty-state">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="card empty-state">
          <p>No past orders found.</p>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order, index) => (
            <article key={index} className="card order-card">
              <div className="order-head">
                <div>
                  <div className="order-label">Order</div>
                  <h3 className="order-id">#{orders.length - index}</h3>
                </div>
                <div className="order-date">
                  {new Date(order.createdAt).toLocaleString()}
                </div>
              </div>
              <ul className="order-items">
                {order.items.map((item, i) => (
                  <li key={i} className="order-item">
                    <div>
                      <div className="order-item-name">{item.name}</div>
                      <div className="order-item-meta">
                        {item.quantity} × ${item.price}
                      </div>
                    </div>
                    <div className="order-item-total">${item.lineTotal}</div>
                  </li>
                ))}
              </ul>
              <div className="order-total">
                <span>Total</span>
                <strong>${order.total}</strong>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default OrderHistory;
