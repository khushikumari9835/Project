import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "./vendor.css";

export default function VendorLayout() {
  const navigate = useNavigate();

<<<<<<< HEAD
=======
  // show current logged-in name if available
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
  let displayName = "Vendor";
  try {
    const stored = JSON.parse(localStorage.getItem("userInfo") || "{}");
    const u = stored.user || stored.userInfo || stored;
    displayName = u?.name || u?.username || u?.email || "Vendor";
  } catch {}

  const onLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  return (
    <div className="v-wrap">
<<<<<<< HEAD
=======
      {/* Sidebar */}
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
      <aside className="v-sidebar">
        <div className="v-brand">
          <div className="v-logo">♻</div>
          <div>
<<<<<<< HEAD
            <div className="v-brand-title">Scrape-Routing</div>
            <div className="v-brand-sub">ScrapRoute</div>
=======
            <div className="v-brand-title">ScrapRoute</div>
            {/*<div className="v-brand-sub">ScrapRoute</div>*/}
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
          </div>
        </div>

        <nav className="v-nav">
          <NavLink
            to="/vendor/incoming"
            className={({ isActive }) => (isActive ? "v-link active" : "v-link")}
          >
            Incoming Requests
          </NavLink>

          <NavLink
            to="/vendor/pickups"
            className={({ isActive }) => (isActive ? "v-link active" : "v-link")}
          >
            Pickups
          </NavLink>

          <NavLink
            to="/vendor/agents"
            className={({ isActive }) => (isActive ? "v-link active" : "v-link")}
          >
            Agents
          </NavLink>

<<<<<<< HEAD
          <NavLink
            to="/vendor/analytics"
            className={({ isActive }) => (isActive ? "v-link active" : "v-link")}
          >
            Agent Analytics
          </NavLink>

=======
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
          <button className="v-link logout" onClick={onLogout}>
            Logout
          </button>
        </nav>

        <div className="v-side-footer">© 2026 ScrapRoute</div>
      </aside>

<<<<<<< HEAD
=======
      {/* Main */}
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
      <main className="v-main">
        <header className="v-topbar">
          <div className="v-welcome">
            <div className="v-welcome-small">Welcome</div>
            <div className="v-welcome-name">{displayName} 👋</div>
          </div>

          <div className="v-topbar-right">
            Manage pickups, agents and recycling operations
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
<<<<<<< HEAD
}
=======
}
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
