import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;

    setForm(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await login(form.email, form.password);
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to log in. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="container py-5" style={{ maxWidth: "480px" }}>
      <h1 className="h3 mb-3">Welcome back</h1>
      <p className="text-muted">
        Log in to access your saved destinations and airlines.
      </p>

      <form onSubmit={handleSubmit}>
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="mb-3">
          <label htmlFor="loginEmail" className="form-label">
            Email
          </label>
          <input
            id="loginEmail"
            type="email"
            name="email"
            className="form-control"
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="loginPassword" className="form-label">
            Password
          </label>
          <input
            id="loginPassword"
            type="password"
            name="password"
            className="form-control"
            value={form.password}
            onChange={handleChange}
            autoComplete="current-password"
            required
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary w-100"
          disabled={submitting}
        >
          {submitting ? "Logging in..." : "Log in"}
        </button>
      </form>

      <p className="text-center mt-4">
        Don't have an account? <Link to="/register">Sign up</Link>
      </p>
    </main>
  );
};

export default Login;
