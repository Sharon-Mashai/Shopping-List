import { useState } from "react";
import bcrypt from "bcryptjs";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import type { AppDispatch } from "../store/store";

import { login } from "../store/slices/authSlice";

import useToast from "../hooks/useToast";

import { createUser } from "../services/api";

function Register() {
  const [name, setName] = useState("");

  const [surname, setSurname] = useState("");

  const [email, setEmail] = useState("");

  const [cellNumber, setCellNumber] = useState("");

  const [password, setPassword] = useState("");

  const [registering, setRegistering] = useState(false);

  const dispatch = useDispatch<AppDispatch>();

  const navigate = useNavigate();

  const { showToast } = useToast();

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();

    if (
      !name.trim() ||
      !surname.trim() ||
      !email.trim() ||
      !cellNumber.trim() ||
      !password
    ) {
      showToast("Please complete all fields.", "warning");

      return;
    }

    try {
      setRegistering(true);

      const passwordHash = await bcrypt.hash(password, 10);

      const newUser = {
        name: name.trim(),
        surname: surname.trim(),
        email: email.trim().toLowerCase(),
        cellNumber: cellNumber.trim(),
        password: passwordHash,
      };

      const createdUser = await createUser(newUser);

      dispatch(
        login({
          id: createdUser.id,
          name: createdUser.name,
          surname: createdUser.surname,
          email: createdUser.email,
          cellNumber: createdUser.cellNumber,
        }),
      );

      showToast("Registration successful!", "success");

      navigate("/home");
    } catch (error) {
      console.error(error);

      showToast("Something went wrong during registration.", "error");
    } finally {
      setRegistering(false);
    }
  };

  return (
    <main className="register-page">
      <section className="register-card">
        <h1>Create Account</h1>

        <p>Register to start managing your shopping lists.</p>

        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label htmlFor="name">Name</label>

            <input
              id="name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Enter your name"
              disabled={registering}
            />
          </div>

          <div className="form-group">
            <label htmlFor="surname">Surname</label>

            <input
              id="surname"
              type="text"
              value={surname}
              onChange={(event) => setSurname(event.target.value)}
              placeholder="Enter your surname"
              disabled={registering}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your email"
              disabled={registering}
            />
          </div>

          <div className="form-group">
            <label htmlFor="cellNumber">Cell Number</label>

            <input
              id="cellNumber"
              type="tel"
              value={cellNumber}
              onChange={(event) => setCellNumber(event.target.value)}
              placeholder="Enter your cell number"
              disabled={registering}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Create a password"
              disabled={registering}
            />
          </div>

          <button
            type="submit"
            className="button button-primary register-button"
            disabled={registering}
          >
            {registering ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </section>
    </main>
  );
}

export default Register;
