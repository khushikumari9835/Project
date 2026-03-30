import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "../vendor/vendor.css"; // ✅ EXACT same CSS as Vendor sidebar

export default function AdminLayout() {
  const navigate = useNavigate();

  let displayName = "Admin";
  try {
    const stored = JSON.parse(localStorage.getItem("userInfo") || "{}");
    const u = stored.user || stored.userInfo || stored;
    displayName = u?.name || u?.username || u?.email || "Admin";
  } catch {}

  const onLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/login", { replace: true });
  };

  return (
    <div className="v-wrap">
      {/* Sidebar */}
      <aside className="v-sidebar">
        <div className="v-brand">
          <div className="v-logo">🛡</div>
          <div>
<<<<<<< HEAD
            <div className="v-brand-title">Scrape-Routing</div>
=======
            <div className="v-brand-title">ScrapRoute</div>
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
            <div className="v-brand-sub">Admin Panel</div>
          </div>
        </div>

        <nav className="v-nav">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) => (isActive ? "v-link active" : "v-link")}
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/seller/dashboard"
            className={({ isActive }) => (isActive ? "v-link active" : "v-link")}
          >
            User Module
          </NavLink>

          <NavLink
            to="/vendor/incoming"
            className={({ isActive }) => (isActive ? "v-link active" : "v-link")}
          >
            Vendor Module
          </NavLink>

          <NavLink
            to="/agent/dashboard"
            className={({ isActive }) => (isActive ? "v-link active" : "v-link")}
          >
            Field Agent Module
          </NavLink>

          <button className="v-link logout" onClick={onLogout}>
            Logout
          </button>
        </nav>

        <div className="v-side-footer">© 2026 ScrapRoute</div>
      </aside>

      {/* Main */}
      <main className="v-main">
        <header className="v-topbar">
          <div className="v-welcome">
            <div className="v-welcome-small">Welcome</div>
            <div className="v-welcome-name">{displayName} 👋</div>
          </div>

          <div className="v-topbar-right">
            Admin can access User, Vendor and Field Agent modules
          </div>
        </header>

        <section className="v-content">
          <Outlet />
        </section>

        <footer className="v-bottom">
          Built for E-Waste Management · ScrapRoute
        </footer>
      </main>
    </div>
  );
}
