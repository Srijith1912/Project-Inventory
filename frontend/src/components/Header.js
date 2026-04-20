import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useGuest } from "../context/GuestContext";
import "./styles/Header.css";

function Header({ cartCount = 0 }) {
  const { isAdmin, logout } = useAuth();
  const { guestId, isSignedIn, signOut } = useGuest();
  const navigate = useNavigate();

  const handleAdminLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="header">
      <div className="header-inner">
        <NavLink to="/" className="brand">
          <span className="brand-mark">P</span>
          <span className="brand-text">
            Pantry<span className="brand-text-accent">Pro</span>
          </span>
        </NavLink>

        <nav className="nav">
          <NavLink to="/" end className="nav-link">
            Shop
          </NavLink>
          <NavLink to="/orders" className="nav-link">
            Orders
          </NavLink>
          <NavLink to="/admin" className="nav-link">
            Admin
          </NavLink>
        </nav>

        <div className="header-actions">
          {isSignedIn ? (
            <div className="guest-pill">
              <span className="guest-pill-label">Signed in as</span>
              <span className="guest-pill-id">{guestId}</span>
              <button
                className="guest-pill-signout"
                onClick={signOut}
                aria-label="Sign out guest"
              >
                ×
              </button>
            </div>
          ) : (
            <NavLink to="/signin" className="btn btn-ghost btn-sm">
              Sign in
            </NavLink>
          )}
          {isAdmin && (
            <button
              className="btn btn-ghost btn-sm"
              onClick={handleAdminLogout}
            >
              Admin sign out
            </button>
          )}
          <NavLink to="/cart" className="cart-btn" aria-label="Cart">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            <span>Cart</span>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </NavLink>
        </div>
      </div>
    </header>
  );
}

export default Header;
