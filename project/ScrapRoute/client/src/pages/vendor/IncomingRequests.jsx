import React, { useEffect, useMemo, useState } from "react";
import { loadItems, updateItem } from "../../utils/localDb";
import "./vendor.css";

<<<<<<< HEAD
function riskBadgeClass(risk) {
  if (risk === "high") return "badge-error";
  if (risk === "medium") return "badge-warning";
  if (risk === "low") return "badge-success";
  return "badge-ghost";
}

=======
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
export default function IncomingRequests() {
  const [items, setItems] = useState([]);

  const vendor = useMemo(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("userInfo") || "{}");
      return stored.user || stored;
    } catch {
      return {};
    }
  }, []);

  const refresh = () => setItems(loadItems());

  useEffect(() => {
    refresh();

    const onLocal = (e) => {
      if (!e?.detail?.type || e.detail.type === "items") refresh();
    };

    const onStorage = (e) => {
      if (e.key === "scraproute_items_v1") refresh();
    };

    window.addEventListener("localdb:update", onLocal);
    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener("localdb:update", onLocal);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const incoming = useMemo(() => {
<<<<<<< HEAD
    return items.filter((x) => (x.status || "Pending") === "Pending");
=======
    return items.filter(
      (x) => (x.status || "Pending") === "Pending"
    );
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
  }, [items]);

  const onAccept = (id) => {
    updateItem(id, {
      status: "Accepted",
      acceptedAt: new Date().toISOString(),
      acceptedByVendorName: vendor?.name || "Vendor",
    });
  };

  const onReject = (id) => {
    updateItem(id, {
      status: "Rejected",
      rejectedAt: new Date().toISOString(),
      rejectedByVendorName: vendor?.name || "Vendor",
    });
  };

  return (
    <div>
      <div className="v-title">
        <h1>Incoming Pickup Requests</h1>
        <p>Requests submitted by users</p>
      </div>

      {incoming.length === 0 ? (
        <div className="v-card text-center text-gray-500 font-bold">
          No incoming requests
        </div>
      ) : (
        incoming.map((item) => (
          <div className="v-card" key={item.id}>
            <div className="v-card-grid">
              <div>
                <div className="v-items-title">
                  {item.title || item.category || "Pickup"}
                </div>
<<<<<<< HEAD

                <div className="v-meta">
                  <div><b>ID:</b> {item.id}</div>
                  <div><b>Address:</b> {item.pickupAddress || "—"}</div>
                  {item.aiEstimatedPricePerKg && (
                    <div><b>AI Price/Kg:</b> ₹{item.aiEstimatedPricePerKg}</div>
                  )}
                  {item.aiEstimatedTotal && (
                    <div><b>AI Total:</b> ₹{item.aiEstimatedTotal}</div>
                  )}
                </div>

                {item.anomalyRisk && (
                  <div className="mt-2">
                    <span className={`badge ${riskBadgeClass(item.anomalyRisk)}`}>
                      AI Risk: {item.anomalyRisk}
                    </span>
                  </div>
                )}

                {Array.isArray(item.anomalyReasons) && item.anomalyReasons.length > 0 && (
                  <ul className="mt-2 text-sm opacity-80 list-disc pl-5">
                    {item.anomalyReasons.map((reason, idx) => (
                      <li key={idx}>{reason}</li>
                    ))}
                  </ul>
                )}
=======
                <div className="v-meta">
                  <div><b>ID:</b> {item.id}</div>
                  <div><b>Address:</b> {item.pickupAddress || "—"}</div>
                </div>
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
              </div>

              <div className="v-actions">
                <button
                  className="v-btn-green"
                  onClick={() => onAccept(item.id)}
                >
                  Accept
                </button>
                <button
                  className="v-btn-red"
                  onClick={() => onReject(item.id)}
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
