import { useEffect, useMemo, useState } from "react";
import { loadItems, updateItem } from "../../utils/localDb";

function getCounts(items) {
  const total = items.length;
  const pending = items.filter((x) => (x.status || "Pending") === "Pending").length;
  const scheduled = items.filter((x) => x.status === "Scheduled").length;
  const completed = items.filter((x) => x.status === "Completed").length;
  const rejected = items.filter((x) => x.status === "Rejected").length;
  return { total, pending, scheduled, completed, rejected };
}

export default function VendorDashboard() {
  const [items, setItems] = useState([]);

  // Vendor identity (same pattern used in SellerLayout)
  const vendor = useMemo(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("userInfo") || "{}");
      return stored.user || stored.userInfo || stored;
    } catch {
      return {};
    }
  }, []);

  useEffect(() => {
    setItems(loadItems());
  }, []);

  const counts = useMemo(() => getCounts(items), [items]);

  // Sort by latest update/created and show last 5 like Seller dashboard
  const recent = useMemo(() => {
    const sorted = [...items].sort((a, b) => {
      const ta = new Date(a.updatedAt || a.createdAt || 0).getTime();
      const tb = new Date(b.updatedAt || b.createdAt || 0).getTime();
      return tb - ta;
    });

    return sorted.slice(0, 5).map((x) => ({
      id: x.id,
      category: x.category,
      status: x.status || "Pending",
      createdAt: x.createdAt,
      updatedAt: x.updatedAt,
      vendorName: x.vendorName,
    }));
  }, [items]);

  const openPending = useMemo(() => {
    // Vendor view: show only Pending items to take action on
    return items
      .filter((x) => (x.status || "Pending") === "Pending")
      .slice(0, 6);
  }, [items]);

  const refresh = () => setItems(loadItems());

  // Vendor actions (stored in localStorage via localDb)
  const schedule = (id) => {
    updateItem(id, {
      status: "Scheduled",
      vendorName: vendor?.name || "Vendor",
      vendorId: vendor?._id || vendor?.id || "",
      scheduledAt: new Date().toISOString(),
    });
    refresh();
  };

  const complete = (id) => {
    updateItem(id, {
      status: "Completed",
      vendorName: vendor?.name || "Vendor",
      vendorId: vendor?._id || vendor?.id || "",
      completedAt: new Date().toISOString(),
    });
    refresh();
  };

  const reject = (id) => {
    updateItem(id, {
      status: "Rejected",
      vendorName: vendor?.name || "Vendor",
      vendorId: vendor?._id || vendor?.id || "",
      rejectedAt: new Date().toISOString(),
    });
    refresh();
  };

  return (
    <div className="space-y-6">
      {/* Stats (same as SellerDashboardNew.jsx) */}
      <div className="grid gap-4 md:grid-cols-5">
        <StatCard label="Total Listings" value={counts.total} />
        <StatCard label="Pending" value={counts.pending} />
        <StatCard label="Scheduled" value={counts.scheduled} />
        <StatCard label="Completed" value={counts.completed} />
        <StatCard label="Rejected" value={counts.rejected} />
      </div>

      {/* Vendor Quick Actions (same card style as Seller) */}
      <div className="card bg-base-100 border border-base-300 shadow-sm">
        <div className="card-body">
          <div className="flex items-center justify-between">
            <div className="card-title">Quick Actions (Pending)</div>
            <button className="btn btn-sm btn-outline" onClick={refresh}>
              Refresh
            </button>
          </div>

          {openPending.length === 0 ? (
            <div className="mt-3 text-sm opacity-70">
              No pending items right now.
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {openPending.map((p) => (
                <div
                  key={p.id}
                  className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 rounded-2xl border border-base-300 bg-base-200/40 p-3"
                >
                  <div className="space-y-1">
                    <div className="text-sm">
                      <span className="opacity-70">Item ID: </span>
                      <span className="font-extrabold">{p.id}</span>
                    </div>
                    <div className="text-sm">
                      <span className="opacity-70">Category: </span>
                      <span className="font-extrabold">{p.category || "—"}</span>
                    </div>
                    <div className="text-xs opacity-60">
                      Uploaded:{" "}
                      {p.createdAt ? new Date(p.createdAt).toLocaleString() : "—"}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`badge ${badgeClass("Pending")}`}>Pending</span>

                    <button
                      className="btn btn-sm btn-info"
                      onClick={() => schedule(p.id)}
                    >
                      Schedule
                    </button>
                    <button
                      className="btn btn-sm btn-success"
                      onClick={() => complete(p.id)}
                    >
                      Complete
                    </button>
                    <button
                      className="btn btn-sm btn-error"
                      onClick={() => reject(p.id)}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-3 text-xs opacity-60">
            Actions update the same localStorage items used by Seller pages, so status changes are shared across modules.
          </div>
        </div>
      </div>

      {/* Recent Activity (same style as SellerDashboardNew.jsx) */}
      <div className="card bg-base-100 border border-base-300 shadow-sm">
        <div className="card-body">
          <div className="card-title">Recent Activity</div>

          {recent.length === 0 ? (
            <div className="mt-3 text-sm opacity-70">
              No activity yet. Items will appear here once users upload.
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

                    {r.updatedAt ? (
                      <div className="text-xs opacity-60">
                        Updated: {new Date(r.updatedAt).toLocaleString()}
                      </div>
                    ) : r.createdAt ? (
                      <div className="text-xs opacity-60">
                        Uploaded: {new Date(r.createdAt).toLocaleString()}
                      </div>
                    ) : null}

                    {r.vendorName ? (
                      <div className="text-xs opacity-60">
                        Vendor: <span className="font-semibold">{r.vendorName}</span>
                      </div>
                    ) : null}
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
