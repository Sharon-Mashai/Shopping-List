import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import type {
  AppDispatch,
  RootState,
} from "../store/store";

import { logout } from "../store/slices/authSlice";

function Profile() {
  const dispatch =
    useDispatch<AppDispatch>();

  const navigate =
    useNavigate();

  const user = useSelector(
    (state: RootState) =>
      state.auth.user,
  );

  const handleLogout = () => {
    const confirmed =
      window.confirm(
        "Are you sure you want to log out?",
      );

    if (!confirmed) {
      return;
    }

    dispatch(logout());

    navigate("/login");
  };

  if (!user) {
    return (
      <main className="profile-page">

        <section className="profile-card">

          <h1>
            Profile
          </h1>

          <p>
            No user information found.
          </p>

          <button
            type="button"
            className="button button-primary"
            onClick={() =>
              navigate("/login")
            }
          >
            Go to Login
          </button>

        </section>

      </main>
    );
  }

  return (
    <main className="profile-page">

      <section className="profile-card">

        <div className="profile-header">

          <div className="profile-avatar">
            {user.name
              .charAt(0)
              .toUpperCase()}
          </div>

          <div>
            <h1>
              My Profile
            </h1>

            <p>
              Manage your account
              information.
            </p>
          </div>

        </div>

        <div className="profile-information">

          <div className="profile-information-item">
            <span>
              Name
            </span>

            <strong>
              {user.name}
            </strong>
          </div>

          <div className="profile-information-item">
            <span>
              Surname
            </span>

            <strong>
              {user.surname}
            </strong>
          </div>

          <div className="profile-information-item">
            <span>
              Email
            </span>

            <strong>
              {user.email}
            </strong>
          </div>

          <div className="profile-information-item">
            <span>
              Cell Number
            </span>

            <strong>
              {user.cellNumber}
            </strong>
          </div>

        </div>

        <div className="profile-actions">

          <button
            type="button"
            className="button button-secondary"
            onClick={() =>
              navigate("/home")
            }
          >
            Back to Home
          </button>

          <button
            type="button"
            className="button button-danger"
            onClick={handleLogout}
          >
            Log Out
          </button>

        </div>

      </section>

    </main>
  );
}

export default Profile;