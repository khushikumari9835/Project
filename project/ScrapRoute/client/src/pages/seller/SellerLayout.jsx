import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useMemo } from "react";

const linkBase =
  "block rounded-lg px-4 py-3 text-sm font-semibold transition";
const linkActive = "bg-white/15 text-white";
const linkIdle = "text-white/90 hover:bg-white/10";

export default function SellerLayout() {
  const navigate = useNavigate();

  const user = useMemo(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("userInfo") || "{}");
      return stored.user || stored.userInfo || stored;
    } catch {
      return {};
    }
  }, []);

  const onLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-base-200">
      <div className="flex min-h-screen">
        {/* LEFT SIDEBAR */}
        <aside className="w-64 bg-gradient-to-b from-emerald-700 to-emerald-600 text-white p-5">
          {/* Logo/Title */}
          <div className="flex items-center gap-3 mb-8">
            <div className="h-10 w-10 rounded-2xl bg-white/15 grid place-items-center text-lg">
              ♻️
            </div>
            <div>
<<<<<<< HEAD
              <div className="text-lg font-extrabold leading-5">Scrape-Routing</div>
              <div className="text-xs opacity-80">ScrapRoute</div>
=======
              <div className="text-lg font-extrabold leading-5">ScrapRoute</div>
              
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
            </div>
          </div>

          {/* Menu */}
          <nav className="space-y-2">
            <NavLink
              to="/seller/dashboard"
              className={({ isActive }) =>
                `${linkBase} ${isActive ? linkActive : linkIdle}`
              }
            >
              Dashboard
            </NavLink>

            <NavLink
              to="/seller/upload"
              className={({ isActive }) =>
                `${linkBase} ${isActive ? linkActive : linkIdle}`
              }
            >
              Upload E-Waste
            </NavLink>

            <NavLink
              to="/seller/listings"
              className={({ isActive }) =>
                `${linkBase} ${isActive ? linkActive : linkIdle}`
              }
            >
              My Listings
            </NavLink>

            <NavLink
              to="/seller/pickup-status"
              className={({ isActive }) =>
                `${linkBase} ${isActive ? linkActive : linkIdle}`
              }
            >
              Pickup Status
            </NavLink>

            <NavLink
              to="/seller/profile"
              className={({ isActive }) =>
                `${linkBase} ${isActive ? linkActive : linkIdle}`
              }
            >
              Profile
            </NavLink>

            <button
              onClick={onLogout}
              className={`${linkBase} ${linkIdle} w-full text-left`}
            >
              Logout
            </button>
          </nav>

          {/* Footer in sidebar */}
          <div className="mt-10 text-xs opacity-80">
            © {new Date().getFullYear()} ScrapRoute
          </div>
        </aside>

        {/* MAIN AREA */}
        <main className="flex-1">
          {/* Top bar (keeps fonts consistent) */}
          <div className="navbar bg-base-100 shadow-sm px-6">
            <div className="flex-1">
              <div className="text-sm opacity-70">Welcome</div>
              <div className="text-lg font-extrabold">
                {user?.name || user?.email || "User"} 👋
              </div>
            </div>
            <div className="flex-none text-sm opacity-70 hidden md:block">
              Manage your e-waste responsibly and easily
            </div>
          </div>

          {/* Page content */}
          <div className="p-6">
            <Outlet />
          </div>

          {/* Page footer */}
          <div className="px-6 pb-6 text-xs opacity-60">
            Built for E-Waste Management · ScrapRoute
          </div>
        </main>
      </div>
    </div>
  );
}
