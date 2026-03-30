<<<<<<< HEAD
import { useEffect, useState } from "react";
import { loadItems } from "../../utils/localDb";
=======
import { useEffect, useMemo, useState } from "react";
import { deleteItem, loadItems } from "../../utils/localDb";
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a

function badgeClass(status) {
  if (status === "Rejected") return "badge-error";
  if (status === "Scheduled") return "badge-info";
  if (status === "Completed") return "badge-success";
  return "badge-warning";
}

<<<<<<< HEAD
function ImageGallery({ item }) {
  const images = item.images || {};

  const hasMultiImages =
    images.front || images.rear || images.back;

  // fallback (old data)
  if (!hasMultiImages && item.image) {
    return (
      <img
        src={item.image}
        alt="Item"
        className="w-full h-40 object-cover rounded-xl border"
      />
    );
  }

  return (
    <div className="grid grid-cols-3 gap-2">
      {/* Front */}
      <div className="text-center">
        <div className="text-xs font-semibold mb-1">Front</div>
        {images.front ? (
          <img
            src={images.front}
            alt="Front"
            className="w-full h-24 object-cover rounded-lg border"
          />
        ) : (
          <div className="h-24 flex items-center justify-center border rounded-lg text-xs opacity-50">
            N/A
          </div>
        )}
      </div>

      {/* Rear */}
      <div className="text-center">
        <div className="text-xs font-semibold mb-1">Rear</div>
        {images.rear ? (
          <img
            src={images.rear}
            alt="Rear"
            className="w-full h-24 object-cover rounded-lg border"
          />
        ) : (
          <div className="h-24 flex items-center justify-center border rounded-lg text-xs opacity-50">
            N/A
          </div>
        )}
      </div>

      {/* Back */}
      <div className="text-center">
        <div className="text-xs font-semibold mb-1">Back</div>
        {images.back ? (
          <img
            src={images.back}
            alt="Back"
            className="w-full h-24 object-cover rounded-lg border"
          />
        ) : (
          <div className="h-24 flex items-center justify-center border rounded-lg text-xs opacity-50">
            N/A
          </div>
        )}
      </div>
    </div>
  );
}

export default function MyListings() {
  const [items, setItems] = useState([]);

  const refresh = () => {
    const data = loadItems();
    setItems(data);
  };

  useEffect(() => {
    refresh();

    // realtime updates
    const onLocal = () => refresh();
    const onStorage = (e) => {
      if (e.key === "scraproute_items_v1") refresh();
    };

    window.addEventListener("localdb:update", onLocal);
    window.addEventListener("storage", onStorage);

    const poll = setInterval(refresh, 2000);

    return () => {
      clearInterval(poll);
      window.removeEventListener("localdb:update", onLocal);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  return (
    <div className="space-y-4">
=======
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
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
      <div className="card bg-base-100 border border-base-300 shadow-sm">
        <div className="card-body">
          <div className="card-title">My Listings</div>

          {items.length === 0 ? (
<<<<<<< HEAD
            <div className="text-sm opacity-70 mt-2">
              No listings yet.
            </div>
          ) : (
            <div className="mt-4 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="border rounded-2xl p-4 bg-base-200/40"
                >
                  <div className="grid md:grid-cols-2 gap-4">
                    
                    {/* LEFT: IMAGE GALLERY */}
                    <ImageGallery item={item} />

                    {/* RIGHT: DETAILS */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="font-bold text-lg">
                          {item.title}
                        </div>
                        <span className={`badge ${badgeClass(item.status)}`}>
                          {item.status}
                        </span>
                      </div>

                      <div className="text-sm opacity-70">
                        ID: {item.id}
                      </div>

                      <div className="text-sm">
                        <b>Category:</b> {item.category}
                      </div>

                      <div className="text-sm">
                        <b>Condition:</b> {item.condition}
                      </div>

                      <div className="text-sm">
                        <b>Address:</b> {item.pickupAddress}
                      </div>

                      <div className="text-sm">
                        <b>Description:</b> {item.description}
                      </div>

                      {item.aiEstimatedTotal && (
                        <div className="text-sm text-success font-semibold">
                          💰 AI Estimate: ₹{item.aiEstimatedTotal}
                        </div>
                      )}

                      {item.anomalyRisk && (
                        <div className="text-sm">
                          ⚠ Risk:{" "}
                          <span className="font-bold">
                            {item.anomalyRisk}
                          </span>
=======
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
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
                        </div>
                      )}
                    </div>

<<<<<<< HEAD
                  </div>
=======
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
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
