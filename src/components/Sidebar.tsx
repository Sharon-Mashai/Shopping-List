import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { HugeiconsIcon } from "@hugeicons/react";
import {Home01Icon,ListViewIcon,UserIcon,Logout01Icon,} from "@hugeicons/core-free-icons";
import type { AppDispatch, RootState,} from "../store/store";
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

    navigate("/login", {
      replace: true,
    });
  };

  return (
    <aside className="sidebar">


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

      <nav className="sidebar-navigation">

        <Link
          to="/home"
          className={
            location.pathname === "/home"
              ? "sidebar-link active"
              : "sidebar-link"
          }
        >
          <span className="sidebar-icon">
            <HugeiconsIcon
              icon={Home01Icon}
              size={20}
            />
          </span>

          <span>Home</span>
        </Link>

        <Link
          to="/home"
          className={
            location.pathname === "/home"
              ? "sidebar-link active"
              : "sidebar-link"
          }
        >
          <span className="sidebar-icon">
            <HugeiconsIcon
              icon={ListViewIcon}
              size={20}
            />
          </span>

          <span>Shopping Lists</span>
        </Link>

        <Link
          to="/profile"
          className={
            location.pathname === "/profile"
              ? "sidebar-link active"
              : "sidebar-link"
          }
        >
          <span className="sidebar-icon">
            <HugeiconsIcon
              icon={UserIcon}
              size={20}
            />
          </span>

          <span>Profile</span>
        </Link>

        <button
          type="button"
          className="sidebar-link sidebar-logout"
          onClick={handleLogout}
        >
          <span className="sidebar-icon">
            <HugeiconsIcon
              icon={Logout01Icon}
              size={20}
            />
          </span>

          <span>Log Out</span>
        </button>

      </nav>

    </aside>
  );
}

export default Sidebar;