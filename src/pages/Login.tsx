import { useState } from "react";
import bcrypt from "bcryptjs";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../store/store";
import { login } from "../store/slices/authSlice";
import useToast from "../hooks/useToast";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleLogin = async (
    event: React.FormEvent,
  ) => {
    event.preventDefault();

    if (!email || !password) {
      showToast(
        "Please enter your email and password.",
        "warning",
      );
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/users?email=${encodeURIComponent(email)}`,
      );

      if (!response.ok) {
        throw new Error(
          "Unable to connect to the server.",
        );
      }

      const users = await response.json();

      if (users.length === 0) {
        showToast(
          "Invalid email or password.",
          "error",
        );
        return;
      }

      const user = users[0];

      const passwordMatches =
        await bcrypt.compare(
          password,
          user.password,
        );

      if (!passwordMatches) {
        showToast(
          "Invalid email or password.",
          "error",
        );
        return;
      }

      dispatch(
        login({
          id: user.id,
          name: user.name,
          surname: user.surname,
          email: user.email,
          cellNumber: user.cellNumber,
        }),
      );

      showToast(
        `Welcome back, ${user.name}!`,
        "success",
      );

      navigate("/home");
    } catch (error) {
      console.error(error);

      showToast(
        "Something went wrong. Please try again.",
        "error",
      );
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-header">
          <h1>Welcome Back!</h1>

          <p>
            Sign in to manage your shopping lists.
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">
              Email
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              placeholder="Enter your password"
            />
          </div>

          <div>
            <button
              type="submit"
              className="button button-primary"
            >
              Sign In
            </button>
          </div>
        </form>

        <p className="auth-footer">
          Don't have an account?{" "}
          <Link to="/register">
            Create an account
          </Link>
        </p>
      </section>
    </main>
  );
}

export default Login;