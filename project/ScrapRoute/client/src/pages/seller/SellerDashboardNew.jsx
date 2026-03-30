import { useEffect, useMemo, useState } from "react";
import { loadItems } from "../../utils/localDb";

function getCounts(items) {
  const total = items.length;

  const pending = items.filter((x) => (x.status || "Pending") === "Pending").length;
  const scheduled = items.filter((x) => x.status === "Scheduled").length;
  const completed = items.filter((x) => x.status === "Completed").length;
  const rejected = items.filter((x) => x.status === "Rejected").length;

  return { total, pending, scheduled, completed, rejected };
}

export default function SellerDashboard() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(loadItems());
  }, []);

  const counts = useMemo(() => getCounts(items), [items]);

  const recent = useMemo(() => {
    return items
      .slice(0, 5)
      .map((x) => ({
        id: x.id,
        category: x.category,
        status: x.status || "Pending",
        createdAt: x.createdAt,
      }));
  }, [items]);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-5">
        <StatCard label="Items Uploaded" value={counts.total} />
        <StatCard label="Pending" value={counts.pending} />
        <StatCard label="Scheduled" value={counts.scheduled} />
        <StatCard label="Completed" value={counts.completed} />
        <StatCard label="Rejected" value={counts.rejected} />
      </div>

      {/* Recent Activity */}
      <div className="card bg-base-100 border border-base-300 shadow-sm">
        <div className="card-body">
          <div className="card-title">Recent Activity</div>

          {recent.length === 0 ? (
            <div className="mt-3 text-sm opacity-70">
              No uploads yet. Go to “Upload E-Waste” and add your first item.
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {recent.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between rounded-2xl border border-base-300 bg-base-200/40 p-3"
                >
                  <div className="space-y-1">
                    <div className="text-sm">
                      <span className="opacity-70">Item ID: </span>
                      <span className="font-extrabold">{r.id}</span>
                    </div>
                    <div className="text-sm">
                      <span className="opacity-70">Category: </span>
                      <span className="font-extrabold">{r.category || "—"}</span>
                    </div>
                    {r.createdAt && (
                      <div className="text-xs opacity-60">
                        Uploaded: {new Date(r.createdAt).toLocaleString()}
                      </div>
                    )}
                  </div>

                  <span className={`badge ${badgeClass(r.status)}`}>{r.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
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

function badgeClass(status) {
  if (status === "Rejected") return "badge-error";
  if (status === "Scheduled") return "badge-info";
  if (status === "Completed") return "badge-success";
  return "badge-warning"; // Pending default
}
