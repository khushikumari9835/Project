import { useEffect, useMemo, useState } from "react";
import { deleteItem, loadItems } from "../../utils/localDb";

function badgeClass(status) {
  if (status === "Rejected") return "badge-error";
  if (status === "Scheduled") return "badge-info";
  if (status === "Completed") return "badge-success";
  return "badge-warning";
}

export default function MyListings() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(loadItems());
  }, []);

  const pickupRequests = useMemo(() => items, [items]);

  const onDelete = (id) => {
    if (!confirm("Delete this item?")) return;
    setItems(deleteItem(id));
  };

  return (
    <div className="space-y-6">
      {/* Listings */}
      <div className="card bg-base-100 border border-base-300 shadow-sm">
        <div className="card-body">
          <div className="card-title">My Listings</div>

          {items.length === 0 ? (
            <div className="mt-3 text-sm opacity-70">
              No listings yet. Upload from “Upload E-Waste”.
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {items.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between rounded-2xl border border-base-300 bg-base-200/40 p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl overflow-hidden border border-base-300 bg-base-100">
                      {p.image ? (
                        <img src={p.image} alt="img" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full grid place-items-center text-xs opacity-60">
                          No Image
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="font-extrabold">{p.title}</div>
                      <div className="text-xs opacity-70">
                        {p.condition} · Year: {p.year}
                      </div>
                      <div className="text-xs opacity-70">Item ID: {p.id}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`badge ${badgeClass(p.status)}`}>{p.status}</span>
                    <button className="btn btn-xs btn-outline" onClick={() => onDelete(p.id)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Pickup Requests */}
      <div className="card bg-base-100 border border-base-300 shadow-sm">
        <div className="card-body">
          <div className="card-title">My Pickup Requests</div>

          {pickupRequests.length === 0 ? (
            <div className="mt-3 text-sm opacity-70">No pickup requests yet.</div>
          ) : (
            <div className="mt-4 space-y-3">
              {pickupRequests.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between rounded-2xl border border-base-300 bg-base-200/40 p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl overflow-hidden border border-base-300 bg-base-100">
                      {r.image ? (
                        <img src={r.image} alt="thumb" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full grid place-items-center text-xs opacity-60">—</div>
                      )}
                    </div>
                    <div>
                      <div className="font-extrabold">{r.title}</div>
                      <div className="text-xs opacity-70">Pickup ID: {r.id}</div>
                    </div>
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
