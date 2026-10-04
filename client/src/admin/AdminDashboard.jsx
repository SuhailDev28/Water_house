import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
const EMPTY_FLAVOUR = {
  name: "",
  slug: "",
  description: "",
  price: "",
};
const EMPTY_FUNCTION = {
  name: "",
  description: "",
};
function makeSlug(value = "") {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
function getInitials(value = "") {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}
function Icon({ children }) {
  return (
    <span className="admin-icon" aria-hidden="true">
      {children}
    </span>
  );
}
export default function AdminDashboard() {
  const navigate = useNavigate();
  const [menu, setMenu] = useState([]);
  const [functions, setFunctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState("");
  const [deleting, setDeleting] = useState("");
  const [message, setMessage] = useState(null);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [flavourSearch, setFlavourSearch] = useState("");
  const [functionSearch, setFunctionSearch] = useState("");
  const [flavourForm, setFlavourForm] = useState(EMPTY_FLAVOUR);
  const [functionForm, setFunctionForm] = useState(EMPTY_FUNCTION);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const notify = useCallback((type, text) => {
    setMessage({ type, text });
    window.clearTimeout(window.__waterHouseAdminMessageTimer);
    window.__waterHouseAdminMessageTimer = window.setTimeout(() => {
      setMessage(null);
    }, 3500);
  }, []);
  const load = useCallback(async ({ silent = false } = {}) => {
    if (silent) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    try {
      const [menuResponse, functionsResponse] = await Promise.all([
        api("/admin/menu"),
        api("/admin/collections/functions"),
      ]);
      setMenu(Array.isArray(menuResponse) ? menuResponse : []);
      setFunctions(Array.isArray(functionsResponse) ? functionsResponse : []);
    } catch (error) {
      console.error("Admin dashboard load failed:", error);
      // Keep your existing authentication behaviour.
      window.location.href = "/admin";
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);
  useEffect(() => {
    load();
    return () => {
      window.clearTimeout(window.__waterHouseAdminMessageTimer);
    };
  }, [load]);
  const flavours = useMemo(() => {
    const query = flavourSearch.trim().toLowerCase();
    if (!query) return menu;
    return menu.filter((item) => {
      return [item.name, item.slug, item.description]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(query);
    });
  }, [menu, flavourSearch]);
  const filteredFunctions = useMemo(() => {
    const query = functionSearch.trim().toLowerCase();
    if (!query) return functions;
    return functions.filter((item) => {
      return [item.name, item.slug, item.description]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(query);
    });
  }, [functions, functionSearch]);
  const stats = useMemo(
    () => [
      {
        label: "Flavours",
        value: menu.length,
        description: "Available flavour options",
        icon: "F",
      },
      {
        label: "Functional boosts",
        value: functions.length,
        description: "Active functional ingredients",
        icon: "+",
      },
      {
        label: "Content items",
        value: menu.length + functions.length,
        description: "Managed database records",
        icon: "C",
      },
      {
        label: "Website",
        value: "Live",
        description: "Public content API",
        icon: "W",
      },
    ],
    [menu.length, functions.length],
  );
  function updateFlavourName(value) {
    setFlavourForm((current) => {
      const previousGeneratedSlug = makeSlug(current.name);
      return {
        ...current,
        name: value,
        slug:
          !current.slug || current.slug === previousGeneratedSlug
            ? makeSlug(value)
            : current.slug,
      };
    });
  }
  async function addMenu(event) {
    event.preventDefault();
    const name = flavourForm.name.trim();
    const slug = makeSlug(flavourForm.slug || flavourForm.name);
    if (!name) {
      notify("error", "Enter a flavour name.");
      return;
    }
    if (!slug) {
      notify("error", "Enter a valid flavour slug.");
      return;
    }
    setSaving("flavour");
    try {
      await api("/admin/menu", {
        method: "POST",
        body: JSON.stringify({
          name,
          slug,
          description: flavourForm.description.trim(),
          price: Number(flavourForm.price || 0),
          category: "Flavour",
        }),
      });
      setFlavourForm(EMPTY_FLAVOUR);
      notify("success", `${name} added successfully.`);
      await load({ silent: true });
    } catch (error) {
      console.error(error);
      notify("error", error?.message || "Unable to add flavour.");
    } finally {
      setSaving("");
    }
  }
  async function addFunction(event) {
    event.preventDefault();
    const name = functionForm.name.trim();
    if (!name) {
      notify("error", "Enter a function name.");
      return;
    }
    setSaving("function");
    try {
      await api("/admin/collections/functions", {
        method: "POST",
        body: JSON.stringify({
          name,
          slug: makeSlug(name),
          description: functionForm.description.trim(),
        }),
      });
      setFunctionForm(EMPTY_FUNCTION);
      notify("success", `${name} added successfully.`);
      await load({ silent: true });
    } catch (error) {
      console.error(error);
      notify("error", error?.message || "Unable to add function.");
    } finally {
      setSaving("");
    }
  }
  function requestDelete(type, item) {
    setConfirmDelete({
      type,
      item,
    });
  }
  async function handleDelete() {
    if (!confirmDelete) return;
    const { type, item } = confirmDelete;
    setDeleting(item._id);
    try {
      if (type === "flavour") {
        await api(`/admin/menu/${item._id}`, {
          method: "DELETE",
        });
      } else {
        await api(`/admin/collections/functions/${item._id}`, {
          method: "DELETE",
        });
      }
      setConfirmDelete(null);
      notify("success", `${item.name || "Item"} removed successfully.`);
      await load({ silent: true });
    } catch (error) {
      console.error(error);
      notify("error", error?.message || "Unable to remove item.");
    } finally {
      setDeleting("");
    }
  }
  function scrollToSection(id) {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
  function logout() {
    sessionStorage.removeItem("wh_admin_token");
    localStorage.removeItem("wh_admin_token");
    sessionStorage.removeItem("wh_admin_user");
    localStorage.removeItem("wh_admin_user");

    navigate("/admin", { replace: true });
  }

  return (
    <div className="wh-admin">
      <aside className="wh-admin-sidebar">
        <div className="wh-admin-sidebar__top">
          <a
            className="wh-admin-brand"
            href="/"
            aria-label="Water House website"
          >
            <img
              className="wh-admin-brand__logo"
              src="/brand/water-house-logo.svg"
              alt="Water House"
            />
          </a>
          <p className="wh-admin-brand__label">CONTENT STUDIO</p>
        </div>
        <nav className="wh-admin-nav">
          <button
            type="button"
            className={
              activeSection === "dashboard"
                ? "wh-admin-nav__item active"
                : "wh-admin-nav__item"
            }
            onClick={() => scrollToSection("dashboard")}
          >
            <Icon>⌂</Icon>
            Dashboard
          </button>
          <button
            type="button"
            className={
              activeSection === "flavours"
                ? "wh-admin-nav__item active"
                : "wh-admin-nav__item"
            }
            onClick={() => scrollToSection("flavours")}
          >
            <Icon>◉</Icon>
            Flavours
            <span className="wh-admin-nav__count">{menu.length}</span>
          </button>
          <button
            type="button"
            className={
              activeSection === "functions"
                ? "wh-admin-nav__item active"
                : "wh-admin-nav__item"
            }
            onClick={() => scrollToSection("functions")}
          >
            <Icon>＋</Icon>
            Functional boosts
            <span className="wh-admin-nav__count">{functions.length}</span>
          </button>
        </nav>
        <div className="wh-admin-sidebar__footer">
          <a href="/" target="_blank" rel="noreferrer">
            <span>View website</span>
            <span>↗</span>
          </a>
          <a href="/menu" target="_blank" rel="noreferrer">
            <span>View menu</span>
            <span>↗</span>
          </a>
          <div className="wh-admin-sidebar__status">
            <span className="status-dot" />
            <span>
              <strong>Website live</strong>
              <small>MongoDB connected</small>
            </span>
          </div>
        </div>
      </aside>
      <main className="wh-admin-main">
        <header className="wh-admin-topbar">
          <div>
            <span className="wh-admin-breadcrumb">
              WATER HOUSE / CONTENT STUDIO
            </span>
          </div>
          <div className="wh-admin-topbar__actions">
            <button
              type="button"
              className="admin-refresh"
              disabled={refreshing}
              onClick={() => load({ silent: true })}
            >
              <span className={refreshing ? "spin" : ""}>↻</span>
              {refreshing ? "Refreshing" : "Refresh"}
            </button>
            <div className="wh-admin-user">
              <span className="wh-admin-user__avatar">WH</span>
              <span>
                <strong>Administrator</strong>
                <small>Content management</small>
              </span>
            </div>
            <button
              type="button"
              className="admin-logout"
              onClick={logout}
              aria-label="Log out of Water House CMS"
            >
              <span aria-hidden="true">↪</span>
              <span>Logout</span>
            </button>
          </div>
        </header>
        <div className="wh-admin-content">
          {message && (
            <div
              className={`admin-toast admin-toast--${message.type}`}
              role="status"
            >
              <span>{message.type === "success" ? "✓" : "!"}</span>
              <strong>{message.text}</strong>
              <button
                type="button"
                aria-label="Close message"
                onClick={() => setMessage(null)}
              >
                ×
              </button>
            </div>
          )}
          <section id="dashboard" className="wh-admin-hero">
            <div>
              <span className="eyebrow">WATER HOUSE CMS</span>
              <h1>
                Content
                <br />
                <em>Dashboard</em>
              </h1>
              <p>
                Manage the content that powers the Water House digital
                experience.
              </p>
            </div>
            <div className="wh-admin-hero__actions">
              <button
                type="button"
                className="btn secondary"
                onClick={() => scrollToSection("functions")}
              >
                Add function
              </button>
              <button
                type="button"
                className="btn primary"
                onClick={() => scrollToSection("flavours")}
              >
                + Add flavour
              </button>
            </div>
          </section>
          <section className="wh-admin-stats">
            {stats.map((stat) => (
              <article className="wh-admin-stat" key={stat.label}>
                <div className="wh-admin-stat__top">
                  <span className="wh-admin-stat__icon">{stat.icon}</span>
                  <span className="wh-admin-stat__status">Active</span>
                </div>
                <strong className="wh-admin-stat__value">
                  {loading ? "—" : stat.value}
                </strong>
                <h3>{stat.label}</h3>
                <p>{stat.description}</p>
              </article>
            ))}
          </section>
          <section id="flavours" className="wh-admin-section">
            <div className="wh-admin-section__header">
              <div>
                <span className="eyebrow">MENU CONTENT</span>
                <h2>Flavours</h2>
                <p>
                  Manage fresh fruit, herb and flavour options shown throughout
                  the Water House experience.
                </p>
              </div>
              <span className="wh-admin-record-count">
                {menu.length} {menu.length === 1 ? "record" : "records"}
              </span>
            </div>
            <div className="wh-admin-grid">
              <article className="wh-admin-card wh-admin-card--form">
                <div className="wh-admin-card__heading">
                  <div>
                    <span className="admin-number">01</span>
                  </div>
                  <div>
                    <h3>Add a flavour</h3>
                    <p>Create a new flavour option.</p>
                  </div>
                </div>
                <form className="wh-admin-form" onSubmit={addMenu}>
                  <label>
                    <span>Flavour name *</span>
                    <input
                      value={flavourForm.name}
                      onChange={(event) =>
                        updateFlavourName(event.target.value)
                      }
                      placeholder="e.g. White Peach"
                      required
                    />
                  </label>
                  <label>
                    <span>Slug *</span>
                    <div className="slug-input">
                      <span>/</span>
                      <input
                        value={flavourForm.slug}
                        onChange={(event) =>
                          setFlavourForm((current) => ({
                            ...current,
                            slug: makeSlug(event.target.value),
                          }))
                        }
                        placeholder="white-peach"
                        required
                      />
                    </div>
                  </label>
                  <label>
                    <span>Description</span>
                    <textarea
                      value={flavourForm.description}
                      onChange={(event) =>
                        setFlavourForm((current) => ({
                          ...current,
                          description: event.target.value,
                        }))
                      }
                      placeholder="Fresh white peach with a delicate, naturally sweet finish."
                      rows="4"
                    />
                  </label>
                  <label>
                    <span>Additional price</span>
                    <div className="price-input">
                      <span>QAR</span>
                      <input
                        type="number"
                        min="0"
                        step="0.5"
                        value={flavourForm.price}
                        onChange={(event) =>
                          setFlavourForm((current) => ({
                            ...current,
                            price: event.target.value,
                          }))
                        }
                        placeholder="0"
                      />
                    </div>
                    <small>Leave at 0 when the flavour is included.</small>
                  </label>
                  <button
                    className="btn primary admin-submit"
                    disabled={saving === "flavour"}
                  >
                    {saving === "flavour" ? "Adding flavour..." : "Add flavour"}
                  </button>
                </form>
              </article>
              <article className="wh-admin-card wh-admin-card--records">
                <div className="wh-admin-list-header">
                  <div>
                    <h3>Current flavours</h3>
                    <p>
                      {flavours.length} of {menu.length} shown
                    </p>
                  </div>
                  <div className="admin-search">
                    <span>⌕</span>
                    <input
                      type="search"
                      value={flavourSearch}
                      onChange={(event) => setFlavourSearch(event.target.value)}
                      placeholder="Search flavours..."
                    />
                  </div>
                </div>
                <div className="wh-admin-list">
                  {loading ? (
                    <AdminListSkeleton />
                  ) : flavours.length ? (
                    flavours.map((item) => (
                      <AdminRecord
                        key={item._id}
                        item={item}
                        type="flavour"
                        deleting={deleting === item._id}
                        onDelete={() => requestDelete("flavour", item)}
                      />
                    ))
                  ) : (
                    <EmptyState
                      title={
                        flavourSearch
                          ? "No matching flavours"
                          : "No flavours yet"
                      }
                      description={
                        flavourSearch
                          ? "Try another search term."
                          : "Add your first flavour using the form."
                      }
                    />
                  )}
                </div>
              </article>
            </div>
          </section>
          <section id="functions" className="wh-admin-section">
            <div className="wh-admin-section__header">
              <div>
                <span className="eyebrow">FUNCTIONAL HYDRATION</span>
                <h2>Functional boosts</h2>
                <p>
                  Manage the functional ingredients customers can add to
                  personalise their hydration ritual.
                </p>
              </div>
              <span className="wh-admin-record-count">
                {functions.length}{" "}
                {functions.length === 1 ? "record" : "records"}
              </span>
            </div>
            <div className="wh-admin-grid">
              <article className="wh-admin-card wh-admin-card--form">
                <div className="wh-admin-card__heading">
                  <div>
                    <span className="admin-number">02</span>
                  </div>
                  <div>
                    <h3>Add a functional boost</h3>
                    <p>Create a new functional ingredient.</p>
                  </div>
                </div>
                <form className="wh-admin-form" onSubmit={addFunction}>
                  <label>
                    <span>Function name *</span>
                    <input
                      value={functionForm.name}
                      onChange={(event) =>
                        setFunctionForm((current) => ({
                          ...current,
                          name: event.target.value,
                        }))
                      }
                      placeholder="e.g. Electrolytes"
                      required
                    />
                  </label>
                  <label>
                    <span>Benefit line</span>
                    <textarea
                      value={functionForm.description}
                      onChange={(event) =>
                        setFunctionForm((current) => ({
                          ...current,
                          description: event.target.value,
                        }))
                      }
                      placeholder="Supports hydration and electrolyte balance."
                      rows="4"
                    />
                  </label>
                  <div className="admin-generated-slug">
                    <span>Generated slug</span>
                    <code>
                      {makeSlug(functionForm.name) || "function-name"}
                    </code>
                  </div>
                  <button
                    className="btn primary admin-submit"
                    disabled={saving === "function"}
                  >
                    {saving === "function"
                      ? "Adding function..."
                      : "Add function"}
                  </button>
                </form>
              </article>
              <article className="wh-admin-card wh-admin-card--records">
                <div className="wh-admin-list-header">
                  <div>
                    <h3>Current functions</h3>
                    <p>
                      {filteredFunctions.length} of {functions.length} shown
                    </p>
                  </div>
                  <div className="admin-search">
                    <span>⌕</span>
                    <input
                      type="search"
                      value={functionSearch}
                      onChange={(event) =>
                        setFunctionSearch(event.target.value)
                      }
                      placeholder="Search functions..."
                    />
                  </div>
                </div>
                <div className="wh-admin-list">
                  {loading ? (
                    <AdminListSkeleton />
                  ) : filteredFunctions.length ? (
                    filteredFunctions.map((item) => (
                      <AdminRecord
                        key={item._id}
                        item={item}
                        type="function"
                        deleting={deleting === item._id}
                        onDelete={() => requestDelete("function", item)}
                      />
                    ))
                  ) : (
                    <EmptyState
                      title={
                        functionSearch
                          ? "No matching functions"
                          : "No functions yet"
                      }
                      description={
                        functionSearch
                          ? "Try another search term."
                          : "Add your first functional boost."
                      }
                    />
                  )}
                </div>
              </article>
            </div>
          </section>
          <footer className="wh-admin-footer">
            <div className="wh-admin-footer__brand">
              <img
                className="wh-admin-footer__logo"
                src="/brand/water-house-logo.svg"
                alt="Water House"
              />
              <span>MODERN HYDRATION RITUAL</span>
            </div>
            <p>Water House Content Studio</p>
          </footer>
        </div>
      </main>
      {confirmDelete && (
        <div
          className="admin-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setConfirmDelete(null);
            }
          }}
        >
          <div
            className="admin-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-title"
          >
            <span className="admin-modal__icon">!</span>
            <h2 id="delete-title">Remove item?</h2>
            <p>
              <strong>{confirmDelete.item.name}</strong> will be permanently
              removed from the Water House content database.
            </p>
            <div className="admin-modal__actions">
              <button
                type="button"
                className="btn secondary"
                onClick={() => setConfirmDelete(null)}
                disabled={Boolean(deleting)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn danger"
                onClick={handleDelete}
                disabled={Boolean(deleting)}
              >
                {deleting ? "Removing..." : "Remove"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
function AdminRecord({ item, type, deleting, onDelete }) {
  const price = Number(item.price || 0);
  return (
    <div className="wh-admin-record">
      <div
        className={`wh-admin-record__avatar wh-admin-record__avatar--${type}`}
      >
        {getInitials(item.name) || "WH"}
      </div>
      <div className="wh-admin-record__content">
        <div className="wh-admin-record__title">
          <strong>{item.name}</strong>
          {type === "flavour" && price > 0 && (
            <span className="admin-price-tag">+ QAR {price}</span>
          )}
        </div>
        {item.description ? (
          <p>{item.description}</p>
        ) : (
          <p className="muted">No description added.</p>
        )}
        {item.slug && <span className="admin-record-slug">/{item.slug}</span>}
      </div>
      <button
        type="button"
        className="admin-delete"
        onClick={onDelete}
        disabled={deleting}
        aria-label={`Remove ${item.name}`}
        title={`Remove ${item.name}`}
      >
        {deleting ? "…" : "×"}
      </button>
    </div>
  );
}
function EmptyState({ title, description }) {
  return (
    <div className="admin-empty">
      <span>+</span>
      <strong>{title}</strong>
      <p>{description}</p>
    </div>
  );
}
function AdminListSkeleton() {
  return (
    <div className="admin-skeleton-list">
      {[1, 2, 3].map((item) => (
        <div className="admin-skeleton" key={item}>
          <span />
          <div>
            <i />
            <i />
          </div>
        </div>
      ))}
    </div>
  );
}
