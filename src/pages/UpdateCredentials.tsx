import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import bcrypt from "bcryptjs";
import type { AppDispatch, RootState } from "../store/store";
import { updateUser } from "../store/slices/authSlice";
import { updateUser as updateUserApi } from "../services/api";
import useToast from "../hooks/useToast";

function UpdateCredentials() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { showToast } = useToast();

  const user = useSelector(
    (state: RootState) => state.auth.user,
  );

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [currentPasswordError, setCurrentPasswordError] = useState("");

  const [newPasswordError, setNewPasswordError] = useState("");

  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const [saving, setSaving] = useState(false);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setCurrentPasswordError("");
    setNewPasswordError("");
    setConfirmPasswordError("");

    if (!user) {
      return;
    }

    let hasError = false;

    if (!currentPassword.trim()) {
      setCurrentPasswordError(
        "Current password required.",
      );

      hasError = true;
    }

    if (!newPassword.trim()) {
      setNewPasswordError(
        "New password required.",
      );

      hasError = true;
    }

    if (!confirmPassword.trim()) {
      setConfirmPasswordError(
        "Confirm your new password.",
      );

      hasError = true;
    }

    if (hasError) {
      return;
    }

    if (newPassword.length < 6) {
      setNewPasswordError(
        "Password must be at least 6 characters.",
      );

      return;
    }

    if (newPassword !== confirmPassword) {
      setConfirmPasswordError(
        "Passwords do not match.",
      );

      return;
    }

    if (currentPassword === newPassword) {
      setNewPasswordError(
        "New password must be different from your current password.",
      );

      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        `http://localhost:3000/users/${user.id}`,
      );

      if (!response.ok) {
        throw new Error(
          "Unable to retrieve user information.",
        );
      }

      const existingUser = await response.json();

      const passwordMatches = await bcrypt.compare(
        currentPassword,
        existingUser.password,
      );

      if (!passwordMatches) {
        setCurrentPasswordError(
          "Current password is incorrect.",
        );

        return;
      }

      const newPasswordHash = await bcrypt.hash(
        newPassword,
        10,
      );

      const updatedUser = {
        id: user.id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        cellNumber: user.cellNumber,
        password: newPasswordHash,
      };

      const savedUser = await updateUserApi(
        user.id,
        updatedUser,
      );

      dispatch(
        updateUser({
          id: savedUser.id,
          name: savedUser.name,
          surname: savedUser.surname,
          email: savedUser.email,
          cellNumber: savedUser.cellNumber,
        }),
      );

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      showToast(
        "Your password has been updated successfully.",
        "success",
      );

      navigate("/profile");
    } catch (error) {
      console.error(error);

      showToast(
        "Unable to update your password. Please try again.",
        "error",
      );
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <main className="form-page">
        <section className="form-card">

          <div className="form-card-header">
            <h1>Update Login Credentials</h1>

            <p>
              No user information was found.
            </p>
          </div>

          <button
            type="button"
            className="button button-primary"
            onClick={() => navigate("/login")}
          >
            Go to Login
          </button>

        </section>
      </main>
    );
  }

  return (
    <main className="form-page">

      <section className="form-card">

        <div className="form-card-header">

          <button
            type="button"
            className="back-button"
            onClick={() => navigate("/profile")}
          >
            ← Back
          </button>

          <h1>
            Update Login Credentials
          </h1>

          <p>
            Change your password to keep your account secure.
          </p>

        </div>

        <form
          className="page-form"
          onSubmit={handleSubmit}
        >

          <div className="form-group">

            <label htmlFor="currentPassword">
              Current Password
            </label>

            <input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(event) => {
                setCurrentPassword(event.target.value);
                setCurrentPasswordError("");
              }}
              placeholder="Enter your current password"
              disabled={saving}
            />

            {currentPasswordError && (
              <p className="field-error">
                {currentPasswordError}
              </p>
            )}

          </div>

          <div className="form-group">

            <label htmlFor="newPassword">
              New Password
            </label>

            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(event) => {
                setNewPassword(event.target.value);
                setNewPasswordError("");
              }}
              placeholder="Enter your new password"
              disabled={saving}
            />

            {newPasswordError && (
              <p className="field-error">
                {newPasswordError}
              </p>
            )}

          </div>

          <div className="form-group">

            <label htmlFor="confirmPassword">
              Confirm New Password
            </label>

            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(event) => {
                setConfirmPassword(event.target.value);
                setConfirmPasswordError("");
              }}
              placeholder="Confirm your new password"
              disabled={saving}
            />

            {confirmPasswordError && (
              <p className="field-error">
                {confirmPasswordError}
              </p>
            )}

          </div>

          <div className="form-actions">

            <button
              type="button"
              className="button button-secondary"
              onClick={() => navigate("/profile")}
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
                ? "Updating..."
                : "Update Password"}
            </button>

          </div>

        </form>

      </section>

    </main>
  );
}

export default UpdateCredentials;