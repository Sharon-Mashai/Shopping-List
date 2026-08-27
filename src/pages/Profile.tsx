import { useState } from "react";
import { useDispatch, useSelector,} from "react-redux";
import { useNavigate } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { Logout01Icon, AlertCircleIcon,} from "@hugeicons/core-free-icons";
import type { AppDispatch, RootState,} from "../store/store";
import { logout, updateUser,} from "../store/slices/authSlice";
import { updateUser as updateUserApi,} from "../services/api";
import useToast from "../hooks/useToast";

function Profile() {
  const dispatch =
    useDispatch<AppDispatch>();

  const navigate = useNavigate();

  const user = useSelector((state: RootState) =>  state.auth.user,);

  const { showToast } = useToast();

  const [editing,setEditing,] = useState(false);

  const [ name, setName,] = useState( user?.name || "",);

  const [surname,setSurname,] = useState( user?.surname || "",);

  const [ email, setEmail,] = useState(  user?.email || "",);

  const [ cellNumber,setCellNumber,] = useState( user?.cellNumber || "",);

  const [ saving, setSaving,] = useState(false);

  const [ error, setError,] = useState<string | null>( null,);

  const [ showLogoutModal, setShowLogoutModal,] = useState(false);

  const handleLogout = () => {setShowLogoutModal(true);};

  const confirmLogout = () => { dispatch(logout());setShowLogoutModal(false);
    navigate("/login"); };

  const handleEdit = () => {
    if (!user) {
      return;
    }

    setName(user.name);
    setSurname(user.surname);
    setEmail(user.email);
    setCellNumber(user.cellNumber);

    setError(null);
    setEditing(true);
  };

  const handleCancel = () => {
    if (!user) {
      return;
    }

    setName(user.name);
    setSurname(user.surname);
    setEmail(user.email);
    setCellNumber(user.cellNumber);

    setError(null);
    setEditing(false);
  };

  const handleSave = async () => {
    if (!user) {
      return;
    }

    setError(null);

    if (!name.trim()) {
      setError(
        "Please enter your name.",
      );

      return;
    }

    if (!surname.trim()) {
      setError(
        "Please enter your surname.",
      );

      return;
    }

    if (!email.trim()) {
      setError(
        "Please enter your email.",
      );

      return;
    }

    if (!cellNumber.trim()) {
      setError(
        "Please enter your cell number.",
      );

      return;
    }

    try {
      setSaving(true);

      const updatedUser = {
        id: user.id,
        name: name.trim(),
        surname: surname.trim(),
        email: email.trim(),
        cellNumber:
          cellNumber.trim(),
      };

      const savedUser =
        await updateUserApi(
          user.id,
          updatedUser,
        );

      dispatch(
        updateUser(savedUser),
      );

      setEditing(false);

      showToast(
        "Profile updated successfully.",
        "success",
      );
    } catch (error) {
      console.error(error);

      const message =
        "Unable to update your profile.";

      setError(message);

      showToast(
        message,
        "error",
      );
    } finally {
      setSaving(false);
    }
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

        {error && (
          <div className="form-error">
            {error}
          </div>
        )}

        {!editing ? (
          <>
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
                className="button button-primary"
                onClick={handleEdit}
              >
                Edit Profile
              </button>

              <button
                type="button"
                className="button button-danger"
                onClick={handleLogout}
              >
                <HugeiconsIcon
                  icon={Logout01Icon}
                  size={18}
                />

                <span>
                  Log Out
                </span>
              </button>
            </div>
          </>
        ) : (
          <form
            className="page-form"
            onSubmit={(event) => {
              event.preventDefault();
              handleSave();
            }}
          >
            <div className="form-group">
              <label htmlFor="name">
                Name
              </label>

              <input
                id="name"
                type="text"
                value={name}
                onChange={(event) =>
                  setName(
                    event.target.value,
                  )
                }
                disabled={saving}
              />
            </div>

            <div className="form-group">
              <label htmlFor="surname">
                Surname
              </label>

              <input
                id="surname"
                type="text"
                value={surname}
                onChange={(event) =>
                  setSurname(
                    event.target.value,
                  )
                }
                disabled={saving}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">
                Email
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(
                    event.target.value,
                  )
                }
                disabled={saving}
              />
            </div>

            <div className="form-group">
              <label htmlFor="cellNumber">
                Cell Number
              </label>

              <input
                id="cellNumber"
                type="tel"
                value={cellNumber}
                onChange={(event) =>
                  setCellNumber(
                    event.target.value,
                  )
                }
                disabled={saving}
              />
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="button button-secondary"
                onClick={handleCancel}
                disabled={saving}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="button button-primary"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </button>
            </div>
          </form>
        )}

        {showLogoutModal && (
          <div
            className="modal-overlay"
            onClick={() => {
              if (!saving) {
                setShowLogoutModal(
                  false,
                );
              }
            }}
          >
            <section
              className="delete-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="logout-modal-title"
              onClick={(event) =>
                event.stopPropagation()
              }
            >
              <div className="delete-modal-icon">
                <HugeiconsIcon
                  icon={
                    AlertCircleIcon
                  }
                  size={28}
                />
              </div>

              <div className="delete-modal-content">
                <h2 id="logout-modal-title">
                  Log Out?
                </h2>

                <p>
                  Are you sure you
                  want to log out of
                  your account?
                </p>

                <span>
                  You will need to sign
                  in again to access
                  your shopping lists.
                </span>
              </div>

              <div className="delete-modal-actions">
                <button
                  type="button"
                  className="button button-secondary"
                  onClick={() =>
                    setShowLogoutModal(
                      false,
                    )
                  }
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="button button-danger"
                  onClick={
                    confirmLogout
                  }
                >
                  <HugeiconsIcon
                    icon={Logout01Icon}
                    size={18}
                  />

                  <span>
                    Log Out
                  </span>
                </button>
              </div>
            </section>
          </div>
        )}
      </section>
    </main>
  );
}

export default Profile;