import { useEffect, useMemo, useRef, useState } from "react";
import api from "../api";
import "./styles/ItemList.css";

const CATEGORY_CLASS = {
  Fruit: "cat-fruit",
  Vegetable: "cat-vegetable",
  Grain: "cat-grain",
  Dairy: "cat-dairy",
  Beverage: "cat-beverage",
  Snack: "cat-snack",
  Electronics: "cat-electronics",
};

const classFor = (type) => CATEGORY_CLASS[type] || "cat-default";

function ItemList({ onAddToCart }) {
  const [items, setItems] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const shopRef = useRef(null);

  useEffect(() => {
    api
      .get("/inventory")
      .then((res) => setItems(res.data))
      .catch((err) => setError(err.response?.data?.error || err.message));
  }, []);

  const categories = useMemo(() => {
    const set = new Set(items.map((i) => i.type).filter(Boolean));
    return ["All", ...Array.from(set)];
  }, [items]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return items.filter((item) => {
      const matchCat =
        activeCategory === "All" || item.type === activeCategory;
      const matchSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        (item.type || "").toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [items, search, activeCategory]);

  const grouped = useMemo(() => {
    const map = new Map();
    filtered.forEach((item) => {
      const key = item.type || "Other";
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(item);
    });
    return Array.from(map.entries());
  }, [filtered]);

  const handleQuantityChange = (id, value) => {
    setQuantities((prev) => ({ ...prev, [id]: value }));
  };

  const handleAdd = (item) => {
    const qty = parseInt(quantities[item._id]) || 1;
    if (qty < 1) return;
    if (qty > item.quantity)
      return alert(`Only ${item.quantity} available in stock`);
    onAddToCart({ ...item, quantity: qty });
    setQuantities((prev) => ({ ...prev, [item._id]: "" }));
  };

  const scrollToShop = () => {
    shopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-bg" aria-hidden="true">
          <div className="hero-blob hero-blob-1" />
          <div className="hero-blob hero-blob-2" />
          <div className="hero-blob hero-blob-3" />
        </div>
        <div className="hero-inner page-container">
          <span className="hero-eyebrow">Fresh · Fast · Friendly</span>
          <h1 className="hero-title">
            Your pantry, <span className="hero-accent">delivered.</span>
          </h1>
          <p className="hero-sub">
            50+ everyday essentials — fruits, veggies, grains, dairy,
            snacks & more. Shop as a guest, no account needed.
          </p>
          <div className="hero-ctas">
            <button className="btn btn-primary hero-btn" onClick={scrollToShop}>
              Shop now ↓
            </button>
            <a className="btn btn-ghost hero-btn" href="#categories">
              Browse categories
            </a>
          </div>
          <div className="hero-perks">
            <div className="perk">
              <span className="perk-dot perk-green" />
              Always in stock
            </div>
            <div className="perk">
              <span className="perk-dot perk-orange" />
              Instant receipt
            </div>
            <div className="perk">
              <span className="perk-dot perk-blue" />
              Guest checkout
            </div>
          </div>
        </div>
      </section>

      <section className="category-strip page-container" id="categories">
        <h2 className="section-title">Shop by category</h2>
        <div className="category-chips">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            const catClass = cat === "All" ? "" : classFor(cat);
            return (
              <button
                key={cat}
                type="button"
                className={`chip ${isActive ? "chip-active" : ""} ${catClass}`}
                onClick={() => {
                  setActiveCategory(cat);
                  scrollToShop();
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </section>

      <section className="shop page-container" ref={shopRef}>
        <div className="shop-header">
          <div>
            <h2 className="section-title">
              {activeCategory === "All" ? "All items" : activeCategory}
            </h2>
            <p className="page-subtitle">
              {filtered.length} item{filtered.length !== 1 ? "s" : ""} available
            </p>
          </div>
          <input
            className="input shop-search"
            type="text"
            placeholder="Search items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {error && <div className="alert-error">{error}</div>}

        {filtered.length === 0 ? (
          <div className="card empty-state">
            <p>No items match your search.</p>
          </div>
        ) : (
          grouped.map(([category, group]) => {
            const catClass = classFor(category);
            return (
              <div className="cat-section" key={category}>
                <div className={`cat-heading ${catClass}`}>
                  <h3 className="cat-heading-title">{category}</h3>
                  <span className="cat-heading-count">{group.length}</span>
                </div>
                <div className="item-grid">
                  {group.map((item) => {
                    const outOfStock = item.quantity <= 0;
                    const cls = classFor(item.type);
                    return (
                      <article key={item._id} className={`item-card ${cls}`}>
                        <div className="item-body">
                          <div className="item-top">
                            <h4 className="item-name">{item.name}</h4>
                            <span className="item-tag">{item.type}</span>
                          </div>
                          <div className="item-price">${item.price}</div>
                          <div
                            className={`item-stock ${
                              outOfStock ? "item-stock-out" : ""
                            }`}
                          >
                            {outOfStock
                              ? "Out of stock"
                              : `${item.quantity} in stock`}
                          </div>
                        </div>
                        <div className="item-actions">
                          <input
                            className="input item-qty"
                            type="number"
                            min="1"
                            placeholder="1"
                            value={quantities[item._id] || ""}
                            onChange={(e) =>
                              handleQuantityChange(item._id, e.target.value)
                            }
                            disabled={outOfStock}
                          />
                          <button
                            className="btn btn-primary item-add"
                            onClick={() => handleAdd(item)}
                            disabled={outOfStock}
                          >
                            Add to cart
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </section>
    </div>
  );
}

export default ItemList;
