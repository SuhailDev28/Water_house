import { useEffect, useState } from "react";

import { useLocation, useNavigate } from "react-router-dom";

import { api } from "../services/api";

function getExistingAdminToken() {
  return (
    sessionStorage.getItem("wh_admin_token") ||
    localStorage.getItem("wh_admin_token") ||
    ""
  );
}

function getErrorMessage(error) {
  if (!error) {
    return "Unable to sign in. Please try again.";
  }

  if (typeof error === "string") {
    return error;
  }

  if (error?.message) {
    return error.message;
  }

  return "Unable to sign in. Please check your credentials.";
}

export default function AdminLogin() {
  const navigate = useNavigate();

  const location = useLocation();

  const [form, setForm] = useState({
    email: "",

    password: "",

    remember: true,
  });

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const token = getExistingAdminToken();

    if (token) {
      navigate("/admin/dashboard", {
        replace: true,
      });
    }
  }, [navigate]);

  function updateField(event) {
    const { name, value, type, checked } = event.target;

    setForm((current) => ({
      ...current,

      [name]: type === "checkbox" ? checked : value,
    }));

    if (error) {
      setError("");
    }
  }

  async function submit(event) {
    event.preventDefault();

    if (loading) return;

    const email = form.email.trim().toLowerCase();

    const password = form.password;

    if (!email) {
      setError("Enter your admin email address.");

      return;
    }

    if (!password) {
      setError("Enter your password.");

      return;
    }

    setLoading(true);

    setError("");

    try {
      const response = await api("/auth/login", {
        method: "POST",

        body: JSON.stringify({
          email,

          password,
        }),
      });

      const token =
        response?.token ||
        response?.accessToken ||
        response?.access_token ||
        "";

      if (!token) {
        throw new Error(
          "Login succeeded, but the server did not return an authentication token.",
        );
      }

      const storage = form.remember ? localStorage : sessionStorage;

      const alternateStorage = form.remember ? sessionStorage : localStorage;

      storage.setItem("wh_admin_token", token);

      alternateStorage.removeItem("wh_admin_token");

      if (response?.user) {
        const adminUser = {
          id: response.user._id || response.user.id || "",

          name: response.user.name || response.user.fullName || "",

          email: response.user.email || email,

          role: response.user.role || "ADMIN",
        };

        storage.setItem("wh_admin_user", JSON.stringify(adminUser));

        alternateStorage.removeItem("wh_admin_user");
      }

      const requestedDestination = location.state?.from?.pathname;

      const destination =
        requestedDestination && requestedDestination.startsWith("/admin")
          ? requestedDestination
          : "/admin/dashboard";

      navigate(destination, {
        replace: true,
      });
    } catch (err) {
      console.error("Admin login failed:", err);

      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="wh-login-page">
      <section className="wh-login-visual">
        <div className="wh-login-brand">
          <a
            href="/"
            className="wh-login-brand__logo"
            aria-label="Water House home"
          >
            <span className="wh-login-brand__drop" aria-hidden="true">
              ●
            </span>

            <span className="wh-login-brand__wordmark">
              water
              <br />
              house
            </span>
          </a>

          <span className="wh-login-brand__tagline">
            MODERN HYDRATION RITUAL
          </span>
        </div>

        <div className="wh-login-visual__content">
          <span className="eyebrow">WATER HOUSE CMS</span>

          <h1>
            Control the
            <br />
            <em>Water House experience.</em>
          </h1>

          <p>
            Manage flavours, functional boosts, website content and the digital
            Water House experience from one place.
          </p>
        </div>

        <div className="wh-login-visual__footer">
          <span>CONTENT STUDIO</span>

          <span>QATAR</span>
        </div>
      </section>

      <section className="wh-login-panel">
        <div className="wh-login-panel__inner">
          <div className="wh-login-mobile-brand">
            <a
              href="/"
              className="wh-login-mobile-brand__logo"
              aria-label="Water House home"
            >
              <span aria-hidden="true">●</span>

              <strong>
                water
                <br />
                house
              </strong>
            </a>

            <span>MODERN HYDRATION RITUAL</span>
          </div>

          <div className="wh-login-heading">
            <span className="eyebrow">ADMIN ACCESS</span>

            <h2>Welcome back.</h2>

            <p>Sign in with your Water House administrator account.</p>
          </div>

          <form className="wh-login-form" onSubmit={submit} noValidate>
            <label className="wh-login-field">
              <span>Email address</span>

              <div className="wh-login-input">
                <span className="wh-login-input__icon" aria-hidden="true">
                  @
                </span>

                <input
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="admin@waterhouse.qa"
                  value={form.email}
                  onChange={updateField}
                  disabled={loading}
                  aria-invalid={Boolean(error)}
                  required
                />
              </div>
            </label>

            <label className="wh-login-field">
              <span>Password</span>

              <div className="wh-login-input">
                <span className="wh-login-input__icon" aria-hidden="true">
                  ⌁
                </span>

                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={updateField}
                  disabled={loading}
                  aria-invalid={Boolean(error)}
                  required
                />

                <button
                  type="button"
                  className="wh-login-password-toggle"
                  onClick={() => setShowPassword((current) => !current)}
                  disabled={loading}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </label>

            <div className="wh-login-options">
              <label className="wh-login-checkbox">
                <input
                  type="checkbox"
                  name="remember"
                  checked={form.remember}
                  onChange={updateField}
                  disabled={loading}
                />

                <span className="wh-login-checkbox__box" aria-hidden="true" />

                <span>Keep me signed in</span>
              </label>
            </div>

            {error && (
              <div className="wh-login-error" role="alert" aria-live="polite">
                <span className="wh-login-error__icon" aria-hidden="true">
                  !
                </span>

                <div>
                  <strong>Sign in failed</strong>

                  <p>{error}</p>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="btn primary wh-login-submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="wh-login-spinner" aria-hidden="true" />

                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign in</span>

                  <span aria-hidden="true">→</span>
                </>
              )}
            </button>
          </form>

          <div className="wh-login-security">
            <span className="wh-login-security__icon" aria-hidden="true">
              ✓
            </span>

            <p>
              Secure administrator access to the Water House Content Studio.
            </p>
          </div>

          <div className="wh-login-panel__footer">
            <a href="/">Back to website</a>

            <span>Water House © {new Date().getFullYear()}</span>
          </div>
        </div>
      </section>
    </main>
  );
}
