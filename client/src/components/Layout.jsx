import { Outlet, NavLink } from "react-router-dom";
import { Menu as MenuIcon, X, Instagram, ArrowUpRight } from "lucide-react";
import { useState } from "react";

const links = [
  ["/", "Home"],
  ["/menu", "Menu"],
  ["/how-it-works", "The Ritual"],
  ["/about", "About"],
  ["/contact", "Contact"],
];

export default function Layout() {
  const [open, setOpen] = useState(false);

  const closeMenu = () => setOpen(false);

  return (
    <div className="site-shell">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="header">
        <NavLink
          className="brand"
          to="/"
          aria-label="Water House home"
          onClick={closeMenu}
        >
          <img
            src="/water-house-logo.svg"
            alt="Water House"
            className="brand-logo"
          />

          <span className="brand-tagline">
            MODERN
            <br />
            HYDRATION
            <br />
            RITUAL
          </span>
        </NavLink>

        <nav
          className={open ? "nav open" : "nav"}
          aria-label="Primary navigation"
        >
          {links.map(([to, label]) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              onClick={closeMenu}
              className={({ isActive }) => (isActive ? "active" : undefined)}
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <NavLink className="nav-cta" to="/contact" onClick={closeMenu}>
          QATAR — COMING SOON
        </NavLink>

        <button
          type="button"
          className="menu-btn"
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={22} /> : <MenuIcon size={22} />}
        </button>
      </header>

      {/* =====================================================
          PAGE
      ===================================================== */}

      <main className="site-main">
        <Outlet />
      </main>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="footer">
        <div className="footer-brand">
          <NavLink to="/" className="footer-logo-link">
            <img
              src="/water-house-logo.svg"
              alt="Water House"
              className="footer-logo"
            />
          </NavLink>

          <p className="footer-tagline">MODERN HYDRATION RITUAL</p>

          <p className="footer-description">
            Water, but reimagined. Fresh flavour, functional ingredients and
            hydration made personal.
          </p>
        </div>

        <div className="footer-navigation">
          <span className="footer-label">EXPLORE</span>

          <div className="footer-links">
            {links.slice(1).map(([to, label]) => (
              <NavLink key={to} to={to}>
                {label}
                <ArrowUpRight size={13} />
              </NavLink>
            ))}
          </div>
        </div>

        <div className="footer-contact">
          <span className="footer-label">WATER HOUSE</span>

          <p>Doha, Qatar</p>

          <a href="mailto:office@waterhouse.qa">
            office@waterhouse.qa
            <ArrowUpRight size={13} />
          </a>

          <a href="#" aria-label="Water House Instagram">
            Instagram
            <Instagram size={14} />
          </a>

          <p className="footer-copyright">
            © {new Date().getFullYear()} Water House
          </p>
        </div>
      </footer>
    </div>
  );
}
