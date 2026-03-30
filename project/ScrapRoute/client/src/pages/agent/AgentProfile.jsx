import { useEffect, useMemo, useState } from "react";
import { loadItems } from "../../utils/localDb";
import { getUser, getRole } from "../../utils/role";

function badgeClass(status) {
  if (status === "Rejected") return "badge-error";
  if (status === "Scheduled") return "badge-info";
  if (status === "Completed") return "badge-success";
  return "badge-success";
}

export default function AgentProfile() {
  const [items, setItems] = useState([]);
  const user = getUser();
  const role = getRole();

  useEffect(() => {
    setItems(loadItems());
  }, []);

  const stats = useMemo(() => {
  const myEmail = user?.email || "";

  const mine = items.filter((x) => (x.assignedAgentEmail || "") === myEmail);

  const total = mine.length;
  const pending = mine.filter((x) => ["Assigned", "Pending"].includes(x.status || "Assigned")).length;
  const scheduled = mine.filter((x) => x.status === "Scheduled").length;
  const completed = mine.filter((x) => x.status === "Completed").length;

  return { total, pending, scheduled, completed };
}, [items, user?.email]);


  const agentId = user?.agentId || user?.employeeId || user?._id?.slice?.(-6) || "AGT-001";
  const phone = user?.phone || user?.mobile || "—";
  const location = user?.location || user?.city || "—";
  const joinDate = user?.joinDate || user?.createdAt || "—";

  return (
    <div className="space-y-6">
      <div>
        <div className="text-2xl font-extrabold">Profile</div>
        <div className="text-sm opacity-70">Field Agent details and stats</div>
      </div>

      {/* ✅ Same Vendor-like card */}
      <div className="card bg-base-100 border border-base-300 shadow-sm">
        <div className="card-body space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xl font-extrabold">{user?.name || "Agent"}</div>
              <div className="text-sm opacity-70">{role === "AGENT" ? "Field Agent" : role}</div>
            </div>

            <div className="flex items-center gap-2">
              <span className="badge badge-outline">ID: {agentId}</span>
              <span className={`badge ${badgeClass("Active")}`}>active</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <InfoRow label="Email" value={user?.email || "—"} />
            <InfoRow label="Phone" value={phone} />
            <InfoRow label="Location" value={location} />
            <InfoRow label="Join Date" value={formatDate(joinDate)} />
          </div>
        </div>
      </div>

      {/* ✅ Same Vendor dashboard stats cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Assigned Pickups" value={stats.total} />
        <StatCard label="Pending" value={stats.pending} />
        <StatCard label="Scheduled" value={stats.scheduled} />
        <StatCard label="Completed" value={stats.completed} />
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="rounded-2xl border border-base-300 bg-base-200/30 p-4">
      <div className="text-xs opacity-70">{label}</div>
      <div className="font-extrabold mt-1">{value}</div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="card bg-base-100 border border-base-300 shadow-sm">
      <div className="card-body">
        <div className="text-xs opacity-70">{label}</div>
        <div className="text-3xl font-extrabold">{value}</div>
      </div>
    </div>
  );
}

function formatDate(v) {
  if (!v || v === "—") return "—";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return String(v);
  return d.toLocaleDateString();
}
