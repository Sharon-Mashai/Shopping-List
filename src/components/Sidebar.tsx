import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { HugeiconsIcon } from "@hugeicons/react";
import { Home01Icon, ListViewIcon, UserIcon, Logout01Icon,} from "@hugeicons/core-free-icons";
import type { AppDispatch, RootState } from "../store/store";
import { logout } from "../store/slices/authSlice";
import useToast from "../hooks/useToast";

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { showToast } = useToast();

  const user = useSelector(
    (state: RootState) => state.auth.user,
  );

  const [showLogoutForm, setShowLogoutForm] =useState(false);

  const handleLogoutClick = () => {setShowLogoutForm(true);};

  const handleCancelLogout = () => {setShowLogoutForm(false);};

  const handleConfirmLogout = () => {
    dispatch(logout());

    setShowLogoutForm(false);

    showToast(
      "You have been logged out successfully.",
      "success",
    );

    navigate("/login", {
      replace: true,
    });
  };

  return (
    <>
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
            onClick={handleLogoutClick}
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

      {showLogoutForm && (
        <div className="modal-overlay">

          <section
            className="confirmation-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-title"
          >

            <div className="confirmation-modal-header">

              <div className="confirmation-modal-icon">
                <HugeiconsIcon
                  icon={Logout01Icon}
                  size={24}
                />
              </div>

              <div>
                <h2 id="logout-title">
                  Log Out
                </h2>

                <p>
                  Are you sure you want to log out?
                </p>
              </div>

            </div>

            <div className="confirmation-modal-actions">

              <button
                type="button"
                className="button button-secondary"
                onClick={handleCancelLogout}
              >
                Cancel
              </button>

              <button
                type="button"
                className="button button-danger"
                onClick={handleConfirmLogout}
              >
                Log Out
              </button>

            </div>

          </section>

        </div>
      )}
    </>
  );
}

export default Sidebar;