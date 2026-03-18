import { useEffect, useState } from "react";
import api from "../api";
import "./AdminInventoryPage.css"

function AdminInventoryPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    name: "",
    type: "",
    price: "",
    quantity: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [msg, setMsg] = useState("");

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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.patch(`/inventory/${editingId}`, {
          ...form,
          price: parseFloat(form.price),
          quantity: parseInt(form.quantity),
        });
        setMsg("Item updated!");
      } else {
        await api.post("/inventory", {
          ...form,
          price: parseFloat(form.price),
          quantity: parseInt(form.quantity),
        });
        setMsg("Item added!");
      }
      resetForm();
      refresh();
    } catch (err) {
      setMsg("Error: " + (err.response?.data?.error || err.message));
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
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this item?")) return;
    await api.delete(`/inventory/${id}`);
    refresh();
  };

  return (
    <div className="container">
      <h1>Admin Inventory</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
        <input class="adminForm"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input class="adminForm"
          name="type"
          placeholder="Type"
          value={form.type}
          onChange={handleChange}
          required
        />
        <input class="adminForm"
          name="price"
          type="number"
          step="0.01"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          required
        />
        <input class="adminForm"
          name="quantity"
          type="number"
          placeholder="Qty"
          value={form.quantity}
          onChange={handleChange}
          required
        />
        <button type="submit" class="button2">{editingId ? "Update Item" : "Add Item"}</button>
        {editingId && (
          <button type="button" onClick={resetForm} class="button4">
            Cancel
          </button>
        )}
      </form>
      {msg && <p>{msg}</p>}

      <table border="1" cellPadding="6">
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Price</th>
            <th>Qty</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item._id}>
              <td>{item.name}</td>
              <td>{item.type}</td>
              <td>${item.price}</td>
              <td>{item.quantity}</td>
              <td>
                <button onClick={() => startEdit(item)} class="button3">Edit</button>
                <button onClick={() => handleDelete(item._id)} class="button4">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminInventoryPage;
