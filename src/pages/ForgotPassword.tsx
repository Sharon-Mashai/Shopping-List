import {
  useState,
} from "react";

import bcrypt from "bcryptjs";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  getUserByEmail,
  updateUser,
} from "../services/api";

import useToast from "../hooks/useToast";

type ForgotPasswordErrors = {
  email?: string;
  newPassword?: string;
  confirmPassword?: string;
};

function ForgotPassword() {
  const [
    email,
    setEmail,
  ] = useState("");

  const [
    newPassword,
    setNewPassword,
  ] = useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [
    fieldErrors,
    setFieldErrors,
  ] =
    useState<ForgotPasswordErrors>(
      {},
    );

  const [
    updating,
    setUpdating,
  ] =
    useState(false);

  const navigate =
    useNavigate();

  const {
    showToast,
  } = useToast();

  const clearFieldError = (
    field:
      keyof ForgotPasswordErrors,
  ) => {
    setFieldErrors(
      (current) => ({
        ...current,
        [field]: undefined,
      }),
    );
  };

  const handleResetPassword =
    async (
      event: React.FormEvent,
    ) => {
      event.preventDefault();

      const errors:
        ForgotPasswordErrors =
        {};

      const normalizedEmail =
        email
          .trim()
          .toLowerCase();

      if (!normalizedEmail) {
        errors.email =
          "Email is required.";
      }

      if (!newPassword) {
        errors.newPassword =
          "New password is required.";
      } else if (
        newPassword.length < 6
      ) {
        errors.newPassword =
          "Password must contain at least 6 characters.";
      }

      if (!confirmPassword) {
        errors.confirmPassword =
          "Please confirm your new password.";
      } else if (
        newPassword !==
        confirmPassword
      ) {
        errors.confirmPassword =
          "Passwords do not match.";
      }

      if (
        Object.keys(
          errors,
        ).length > 0
      ) {
        setFieldErrors(
          errors,
        );

        return;
      }

      try {
        setUpdating(true);

        setFieldErrors({});

        const users =
          await getUserByEmail(
            normalizedEmail,
          );

        if (
          users.length === 0
        ) {
          setFieldErrors({
            email:
              "No account was found with this email address.",
          });

          return;
        }

        const user =
          users[0];

        const hashedPassword =
          await bcrypt.hash(
            newPassword,
            10,
          );

        await updateUser(
          user.id,
          {
            password:
              hashedPassword,
          },
        );

        showToast(
          "Password updated successfully. You can now sign in.",
          "success",
        );

        navigate(
          "/login",
        );
      } catch (error) {
        console.error(
          error,
        );

        showToast(
          "Unable to update your password. Please try again.",
          "error",
        );
      } finally {
        setUpdating(
          false,
        );
      }
    };

  return (
    <main className="auth-page">

      <section className="auth-card">

        <div className="auth-header">

          <h1>
            Reset Password
          </h1>

          <p>
            Enter your email and
            create a new password.
          </p>

        </div>


        <form
          onSubmit={
            handleResetPassword
          }
          autoComplete="off"
        >

          <div className="form-group">

            <label htmlFor="resetEmail">
              Email
            </label>

            <input
              id="resetEmail"
              name="reset-email"
              type="email"
              value={email}
              onChange={(
                event,
              ) => {
                setEmail(
                  event.target
                    .value,
                );

                clearFieldError(
                  "email",
                );
              }}
              placeholder="Enter your email"
              autoComplete="off"
              className={
                fieldErrors.email
                  ? "input-error"
                  : ""
              }
              disabled={
                updating
              }
            />

            {fieldErrors.email && (
              <p className="field-error">
                {
                  fieldErrors.email
                }
              </p>
            )}

          </div>


          <div className="form-group">

            <label htmlFor="newPassword">
              New Password
            </label>

            <input
              id="newPassword"
              name="new-password"
              type="password"
              value={
                newPassword
              }
              onChange={(
                event,
              ) => {
                setNewPassword(
                  event.target
                    .value,
                );

                clearFieldError(
                  "newPassword",
                );

                clearFieldError(
                  "confirmPassword",
                );
              }}
              placeholder="Enter your new password"
              autoComplete="new-password"
              className={
                fieldErrors.newPassword
                  ? "input-error"
                  : ""
              }
              disabled={
                updating
              }
            />

            {fieldErrors.newPassword && (
              <p className="field-error">
                {
                  fieldErrors.newPassword
                }
              </p>
            )}

          </div>


          <div className="form-group">

            <label htmlFor="confirmPassword">
              Confirm Password
            </label>

            <input
              id="confirmPassword"
              name="confirm-password"
              type="password"
              value={
                confirmPassword
              }
              onChange={(
                event,
              ) => {
                setConfirmPassword(
                  event.target
                    .value,
                );

                clearFieldError(
                  "confirmPassword",
                );
              }}
              placeholder="Confirm your new password"
              autoComplete="new-password"
              className={
                fieldErrors.confirmPassword
                  ? "input-error"
                  : ""
              }
              disabled={
                updating
              }
            />

            {fieldErrors.confirmPassword && (
              <p className="field-error">
                {
                  fieldErrors.confirmPassword
                }
              </p>
            )}

          </div>


          <button
            type="submit"
            className="button button-primary auth-submit-button"
            disabled={
              updating
            }
          >
            {updating
              ? "Updating..."
              : "Update Password"}
          </button>

        </form>


        <p className="auth-footer">

          Remember your password?{" "}

          <Link to="/login">
            Back to Sign In
          </Link>

        </p>

      </section>

    </main>
  );
}

export default ForgotPassword;