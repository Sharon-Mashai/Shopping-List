import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store/store";
import { logout } from "../store/slices/authSlice";

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const user = useSelector(
    (state: RootState) => state.auth.user,
  );

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  return (
    <aside className="sidebar">

      {/* Profile */}
      <div className="sidebar-profile">
        <div className="sidebar-avatar">
          {user?.name?.charAt(0).toUpperCase() || "S"}
        </div>

        <h2>
          {user
            ? `${user.name} ${user.surname}`
            : "User"}
        </h2>

        <p>
          {user?.email || ""}
        </p>
      </div>

      {/* Navigation */}
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
          className={
            location.pathname === "/home"
              ? "sidebar-link"
              : "sidebar-link"
          }
        >
          <span className="sidebar-icon">☷</span>
          <span>Shopping Lists</span>
        </Link>

        <Link
          to="/create-shopping-list"
          className={
            location.pathname === "/create-shopping-list"
              ? "sidebar-link active"
              : "sidebar-link"
          }
        >
          <span className="sidebar-icon">+</span>
          <span>Add List</span>
        </Link>

        <Link
          to="/profile"
          className={
            location.pathname === "/profile"
              ? "sidebar-link active"
              : "sidebar-link"
          }
        >
          <span className="sidebar-icon">♙</span>
          <span>Profile</span>
        </Link>

        {/* Logout */}
        <button
          type="button"
          className="sidebar-link sidebar-logout"
          onClick={handleLogout}
        >
          <span className="sidebar-icon">↪</span>
          <span>Log Out</span>
        </button>

      </nav>

    </aside>
  );
}

export default Sidebar;