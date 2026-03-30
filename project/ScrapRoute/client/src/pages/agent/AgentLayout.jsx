import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { getUser } from "../../utils/role";

export default function AgentLayout() {
  const navigate = useNavigate();
  const user = getUser();

  const logout = () => {
    localStorage.removeItem("userInfo");
    navigate("/login", { replace: true });
  };

  const link = ({ isActive }) =>
    `block rounded-lg px-4 py-3 text-sm font-semibold transition ${
      isActive ? "bg-white/15 text-white" : "text-white/90 hover:bg-white/10"
    }`;

  return (
    <div className="min-h-screen bg-base-200">
      <div className="flex min-h-screen">
        {/* ✅ Same sidebar styling as Vendor */}
        <aside className="w-64 bg-gradient-to-b from-emerald-700 to-emerald-600 text-white p-5">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-10 w-10 rounded-2xl bg-white/15 grid place-items-center text-lg">
              ♻️
            </div>
            <div>
              <div className="text-lg font-extrabold leading-5">ScrapRoute</div>
              <div className="text-xs opacity-80">Field Agent</div>
            </div>
          </div>

          <nav className="space-y-2">
            <NavLink to="/agent/dashboard" className={link}>
              Dashboard
            </NavLink>

            <NavLink to="/agent/pickups" className={link}>
              Assigned Pickups
            </NavLink>

            <NavLink to="/agent/route" className={link}>
              Optimised Route
            </NavLink>

            <NavLink to="/agent/profile" className={link}>
              Profile
            </NavLink>

            <button
              onClick={logout}
              className="block w-full text-left rounded-lg px-4 py-3 text-sm font-semibold text-white/90 hover:bg-white/10"
            >
              Logout
            </button>
          </nav>
        </aside>

        {/* ✅ Same top header styling as Vendor */}
        <main className="flex-1 flex flex-col">
          <div className="navbar bg-base-100 shadow-sm px-6">
            <div className="flex-1">
              <div className="text-sm opacity-70">Welcome</div>
              <div className="text-lg font-extrabold">
                {user?.name || user?.email || "Agent"} 👋
              </div>
            </div>
          </div>

          <div className="p-6 flex-1">
            <Outlet />
          </div>

          <div className="px-6 pb-6 text-xs opacity-60">
            © {new Date().getFullYear()} ScrapRoute
          </div>
        </main>
      </div>
    </div>
  );
}
