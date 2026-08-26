import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const user = useSelector(
    (state: RootState) => state.auth.user,
  );

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const firstLetter =
    user?.name?.charAt(0).toUpperCase() || "U";

  const handleLogout = () => {
    /*
      We are only navigating for now.

      Once we confirm the exact logout action
      in your AuthSlice, we can connect it here
      so it also clears the Redux authentication state.
    */
    navigate("/login");
  };

  return (
    <aside className="sidebar">

      {/* User Profile */}
      <div className="sidebar-profile">

        <div className="sidebar-avatar">
          {firstLetter}
        </div>

        <h2>
          {user?.name || "User"}
        </h2>

        <p>
          {user?.email || ""}
        </p>

      </div>

      {/* Navigation */}
      <nav className="sidebar-navigation">

        <Link
          to="/home"
          className={`sidebar-link ${
            isActive("/home")
              ? "sidebar-link-active"
              : ""
          }`}
        >
          <span className="sidebar-link-icon">
            🏠
          </span>

          <span>
            Home
          </span>
        </Link>

        <Link
          to="/home"
          className={`sidebar-link ${
            isActive("/home")
              ? "sidebar-link-active"
              : ""
          }`}
        >
          <span className="sidebar-link-icon">
            ☷
          </span>

          <span>
            Shopping Lists
          </span>
        </Link>

        <Link
          to="/create-shopping-list"
          className={`sidebar-link ${
            isActive("/create-shopping-list")
              ? "sidebar-link-active"
              : ""
          }`}
        >
          <span className="sidebar-link-icon">
            +
          </span>

          <span>
            Add List
          </span>
        </Link>

        <Link
          to="/profile"
          className={`sidebar-link ${
            isActive("/profile")
              ? "sidebar-link-active"
              : ""
          }`}
        >
          <span className="sidebar-link-icon">
            ♙
          </span>

          <span>
            Profile
          </span>
        </Link>

        <button
          type="button"
          className="sidebar-link sidebar-link-button"
          onClick={() =>
            alert(
              "About page coming soon.",
            )
          }
        >
          <span className="sidebar-link-icon">
            ⓘ
          </span>

          <span>
            About
          </span>
        </button>

      </nav>

      {/* Logout */}
      <div className="sidebar-footer">

        <button
          type="button"
          className="sidebar-logout"
          onClick={handleLogout}
        >
          <span className="sidebar-link-icon">
            ↪
          </span>

          <span>
            Log Out
          </span>
        </button>

      </div>

    </aside>
  );
}

export default Sidebar;