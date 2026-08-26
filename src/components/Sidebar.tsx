import { Link, useLocation } from "react-router-dom";

function Sidebar() {
  const location = useLocation();

  return (
    <aside className="sidebar">

      <div className="sidebar-profile">
        <div className="sidebar-avatar">
          S
        </div>

        <h2>Sharon Mashai</h2>
        <p>sharon@example.com</p>
      </div>

      <nav className="sidebar-navigation">

        <Link
          to="/home"
          className={
            location.pathname === "/home"
              ? "sidebar-link active"
              : "sidebar-link"
          }
        >
          <span className="sidebar-icon">⌂</span>
          <span>Home</span>
        </Link>

        <Link
          to="/home"
          className="sidebar-link"
        >
          <span className="sidebar-icon">☷</span>
          <span>Shopping Lists</span>
        </Link>

        <Link
          to="/create-shopping-list"
          className="sidebar-link"
        >
          <span className="sidebar-icon">+</span>
          <span>Add List</span>
        </Link>

        <Link
          to="/profile"
          className="sidebar-link"
        >
          <span className="sidebar-icon">♙</span>
          <span>Profile</span>
        </Link>

        <button
          type="button"
          className="sidebar-link sidebar-logout"
        >
          <span className="sidebar-icon">↪</span>
          <span>Log Out</span>
        </button>

      </nav>

    </aside>
  );
}

export default Sidebar;