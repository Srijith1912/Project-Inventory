import { useEffect, useRef, useState } from "react";
import api from "../api";
import "./AdminInventoryPage.css";

function AdminInventoryPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    name: "",
    type: "",
    price: "",
    quantity: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [editingOriginal, setEditingOriginal] = useState(null);
  const [msg, setMsg] = useState(null);
  const formRef = useRef(null);

  useEffect(() => {
    refresh();
  }, []);

  const refresh = () =>
    api
      .get("/inventory")
      .then((res) => setItems(res.data))
      .catch((err) => console.error(err));

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const resetForm = () => {
    setForm({ name: "", type: "", price: "", quantity: "" });
    setEditingId(null);
    setEditingOriginal(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg(null);
    try {
      const payload = {
        ...form,
        price: parseFloat(form.price),
        quantity: parseInt(form.quantity),
      };
      if (editingId) {
        await api.patch(`/inventory/${editingId}`, payload);
        setMsg({ type: "success", text: `Updated "${payload.name}".` });
      } else {
        await api.post("/inventory", payload);
        setMsg({ type: "success", text: `Added "${payload.name}".` });
      }
      resetForm();
      refresh();
    } catch (err) {
      setMsg({
        type: "error",
        text: err.response?.data?.error || err.message,
      });
    }
  };

  const startEdit = (item) => {
    setForm({
      name: item.name,
      type: item.type,
      price: item.price,
      quantity: item.quantity,
    });
    setEditingId(item._id);
    setEditingOriginal(item);
    setMsg(null);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try {
      await api.delete(`/inventory/${id}`);
      setMsg({ type: "success", text: `Deleted "${name}".` });
      refresh();
    } catch (err) {
      setMsg({
        type: "error",
        text: err.response?.data?.error || err.message,
      });
    }
  };

  return (
    <section className="admin page-container">
      <div className="admin-heading">
        <div>
          <h1 className="page-title">Admin Inventory</h1>
          <p className="page-subtitle">
            Add, edit, or remove items. Default items are automatically
            restored on server restart.
          </p>
        </div>
        <div className="admin-stat">
          <div className="admin-stat-value">{items.length}</div>
          <div className="admin-stat-label">items in stock</div>
        </div>
      </div>

      <div
        ref={formRef}
        className={`card admin-form-card ${editingId ? "is-editing" : ""}`}
      >
        {editingId ? (
          <div className="edit-banner">
            <div>
              <div className="edit-banner-label">Editing item</div>
              <div className="edit-banner-name">
                {editingOriginal?.name || form.name}
              </div>
            </div>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={resetForm}
            >
              Cancel edit
            </button>
          </div>
        ) : (
          <h2 className="admin-section-title">Add a new item</h2>
        )}
        <form onSubmit={handleSubmit} className="admin-form">
          <label className="field">
            <span className="field-label">Name</span>
            <input
              className="input"
              name="name"
              placeholder="e.g. Apples"
              value={form.name}
              onChange={handleChange}
              required
            />
          </label>
          <label className="field">
            <span className="field-label">Type</span>
            <input
              className="input"
              name="type"
              placeholder="e.g. Fruit"
              value={form.type}
              onChange={handleChange}
              required
            />
          </label>
          <label className="field">
            <span className="field-label">Price</span>
            <input
              className="input"
              name="price"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={form.price}
              onChange={handleChange}
              required
            />
          </label>
          <label className="field">
            <span className="field-label">Quantity</span>
            <input
              className="input"
              name="quantity"
              type="number"
              placeholder="0"
              value={form.quantity}
              onChange={handleChange}
              required
            />
          </label>
          <div className="admin-form-actions">
            <button type="submit" className="btn btn-primary">
              {editingId ? "Save changes" : "Add item"}
            </button>
            {editingId && (
              <button
                type="button"
                className="btn btn-ghost"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
        {msg && (
          <div
            className={
              msg.type === "error" ? "alert-error" : "alert-success"
            }
            style={{ marginTop: "1rem" }}
          >
            {msg.text}
          </div>
        )}
      </div>

      <div className="card admin-table-card">
        <h2 className="admin-section-title">Catalog</h2>
        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Price</th>
                <th>Qty</th>
                <th className="admin-actions-col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan="5" className="admin-empty">
                    No items yet. Add one above.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr
                    key={item._id}
                    className={editingId === item._id ? "row-editing" : ""}
                  >
                    <td>{item.name}</td>
                    <td>
                      <span className="item-tag">{item.type}</span>
                    </td>
                    <td>${item.price}</td>
                    <td>{item.quantity}</td>
                    <td>
                      <div className="admin-row-actions">
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => startEdit(item)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(item._id, item.name)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default AdminInventoryPage;
