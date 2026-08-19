import { useState } from "react";
import bcrypt from "bcryptjs";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!email || !password) {
      alert("Please enter your email and password.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/users?email=${encodeURIComponent(email)}`,
      );

      if (!response.ok) {
        throw new Error("Unable to connect to the server.");
      }

      const users = await response.json();

      if (users.length === 0) {
        alert("Invalid email or password.");
        return;
      }

      const user = users[0];

      const passwordMatches = await bcrypt.compare(password, user.password);

      if (!passwordMatches) {
        alert("Invalid email or password.");
        return;
      }

      alert(`Welcome back, ${user.name}!`);
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-header">
          <h1>Welcome Back!</h1>
          <p>Sign in to manage your shopping lists.</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Email</label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
            />
          </div>

          <div>
            {" "}
            <button type="submit" className="button button-primary">
              Sign In
            </button>
          </div>
        </form>

        <p className="auth-footer">
          Don't have an account? <a href="/register">Create an account</a>
        </p>
      </section>
    </main>
  );
}

export default Login;
