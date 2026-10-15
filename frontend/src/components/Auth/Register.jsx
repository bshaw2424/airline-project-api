import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const { register, login } = useAuth();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
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

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);

    try {
      await register(form.username, form.email, form.password);
      await login(form.email, form.password);
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to create your account. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="container py-5" style={{ maxWidth: "480px" }}>
      <h1 className="h3 mb-3">Create your account</h1>
      <p className="text-muted">
        Save your favorite destinations and start planning future trips.
      </p>

      <form onSubmit={handleSubmit}>
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="mb-3">
          <label htmlFor="registerUsername" className="form-label">
            Username
          </label>
          <input
            id="registerUsername"
            name="username"
            className="form-control"
            value={form.username}
            onChange={handleChange}
            autoComplete="username"
            minLength={3}
            maxLength={30}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="registerEmail" className="form-label">
            Email
          </label>
          <input
            id="registerEmail"
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
          <label htmlFor="registerPassword" className="form-label">
            Password
          </label>
          <input
            id="registerPassword"
            type="password"
            name="password"
            className="form-control"
            value={form.password}
            onChange={handleChange}
            autoComplete="new-password"
            minLength={12}
            required
          />
          <div className="form-text">At least 12 characters.</div>
        </div>

        <div className="mb-3">
          <label htmlFor="registerConfirmPassword" className="form-label">
            Confirm password
          </label>
          <input
            id="registerConfirmPassword"
            type="password"
            name="confirmPassword"
            className="form-control"
            value={form.confirmPassword}
            onChange={handleChange}
            autoComplete="new-password"
            required
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary w-100"
          disabled={submitting}
        >
          {submitting ? "Creating account..." : "Create account"}
        </button>
      </form>

      <p className="text-center mt-4">
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </main>
  );
};

export default Register;
