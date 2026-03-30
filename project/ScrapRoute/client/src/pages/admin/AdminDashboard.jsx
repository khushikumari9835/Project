<<<<<<< HEAD
import { useState, useEffect, useContext, useMemo } from "react";
import axios from "axios";
import AuthContext from "../../context/AuthContext";
import { loadItems } from "../../utils/localDb";

function riskBadgeClass(risk) {
  if (risk === "high") return "badge-error";
  if (risk === "medium") return "badge-warning";
  if (risk === "low") return "badge-success";
  return "badge-ghost";
}

export default function AdminDashboard() {
  const { user, logout } = useContext(AuthContext);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");
  const [riskFilter, setRiskFilter] = useState("all");
  const [localItems, setLocalItems] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const userInfo = localStorage.getItem("userInfo");
        if (!userInfo) {
          setLoading(false);
          return;
        }

        const parsed = JSON.parse(userInfo);
        const token = parsed?.token;

        if (!token) {
          setLoading(false);
          return;
        }

        const { data } = await axios.get("http://localhost:5000/api/products", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Fetch error", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
    setLocalItems(loadItems());

    const onLocal = (e) => {
      if (!e?.detail?.type || e.detail.type === "items") {
        setLocalItems(loadItems());
      }
    };

    const onStorage = (e) => {
      if (e.key === "scraproute_items_v1") {
        setLocalItems(loadItems());
      }
    };

    window.addEventListener("localdb:update", onLocal);
    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener("localdb:update", onLocal);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const handleAction = async (id, status) => {
    try {
      const userInfo = localStorage.getItem("userInfo");
      if (!userInfo) return;

      const { token } = JSON.parse(userInfo);

      await axios.put(
        `http://localhost:5000/api/products/verify/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setProducts((prev) =>
        prev.map((p) =>
          p._id === id ? { ...p, verificationStatus: status } : p
        )
      );
    } catch (err) {
      alert("Action failed");
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const statusOk = filter === "all" ? true : p.verificationStatus === filter;
      const riskOk = riskFilter === "all" ? true : p.anomalyRisk === riskFilter;
      return statusOk && riskOk;
    });
  }, [products, filter, riskFilter]);

  const localSummary = useMemo(() => {
    const total = localItems.length;
    const high = localItems.filter((x) => x.anomalyRisk === "high").length;
    const medium = localItems.filter((x) => x.anomalyRisk === "medium").length;
    const low = localItems.filter((x) => x.anomalyRisk === "low").length;

    return { total, high, medium, low };
  }, [localItems]);

  const riskyLocalItems = useMemo(() => {
    return localItems.filter(
      (x) => x.anomalyRisk === "high" || x.anomalyRisk === "medium"
    );
  }, [localItems]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Admin: {user?.name}</h1>
        <button onClick={logout} className="btn btn-sm btn-error text-white">
          Logout
        </button>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-xs text-gray-500">Local Requests</div>
          <div className="text-2xl font-bold">{localSummary.total}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-xs text-gray-500">High Risk</div>
          <div className="text-2xl font-bold text-red-600">{localSummary.high}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-xs text-gray-500">Medium Risk</div>
          <div className="text-2xl font-bold text-orange-500">{localSummary.medium}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-xs text-gray-500">Low Risk</div>
          <div className="text-2xl font-bold text-green-600">{localSummary.low}</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <div className="font-bold text-lg">Backend Product Moderation</div>
          <div className="text-sm text-gray-500">
            Uses MongoDB-backed products and ML flags from the backend
          </div>
        </div>

        <div className="p-4 border-b flex flex-wrap gap-2">
          {["pending", "verified", "all"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`btn btn-xs capitalize ${filter === s ? "btn-primary" : ""}`}
            >
              {s}
            </button>
          ))}

          {["all", "high", "medium", "low"].map((r) => (
            <button
              key={r}
              onClick={() => setRiskFilter(r)}
              className={`btn btn-xs capitalize ${riskFilter === r ? "btn-secondary" : ""}`}
            >
              risk: {r}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>AI Price/Kg</th>
                <th>Risk</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {!loading &&
                filteredProducts.map((item) => (
                  <tr key={item._id}>
                    <td className="font-medium">
                      <div>{item.title}</div>
                      {Array.isArray(item.anomalyReasons) && item.anomalyReasons.length > 0 && (
                        <div className="text-xs text-gray-500 mt-1">
                          {item.anomalyReasons[0]}
                        </div>
                      )}
                    </td>
                    <td>
                      <span className="badge badge-ghost">{item.verificationStatus}</span>
                    </td>
                    <td>{item.aiEstimatedPricePerKg ? `₹${item.aiEstimatedPricePerKg}` : "—"}</td>
                    <td>
                      {item.anomalyRisk ? (
                        <span className={`badge ${riskBadgeClass(item.anomalyRisk)}`}>
                          {item.anomalyRisk}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td>
                      {item.verificationStatus === "pending" && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAction(item._id, "verified")}
                            className="btn btn-xs btn-success text-white"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleAction(item._id, "rejected")}
                            className="btn btn-xs btn-error text-white"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}

              {!loading && filteredProducts.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center text-gray-500 py-6">
                    No backend products found for the current filter.
                  </td>
                </tr>
              )}

              {loading && (
                <tr>
                  <td colSpan="5" className="text-center py-6">
                    Loading...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <div className="font-bold text-lg">Local AI Risk Review</div>
          <div className="text-sm text-gray-500">
            Reviews user uploads saved in localStorage so your current seller/vendor workflow keeps working
          </div>
        </div>

        <div className="p-4 space-y-3">
          {riskyLocalItems.length === 0 ? (
            <div className="text-sm text-gray-500">No medium/high-risk local requests found.</div>
          ) : (
            riskyLocalItems.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-base-300 bg-base-200/40 p-4"
              >
                <div className="flex flex-wrap justify-between gap-3">
                  <div>
                    <div className="font-bold">{item.title}</div>
                    <div className="text-xs opacity-70">ID: {item.id}</div>
                    <div className="text-xs opacity-70">
                      AI Price/Kg: {item.aiEstimatedPricePerKg ? `₹${item.aiEstimatedPricePerKg}` : "—"}
                    </div>
                    <div className="text-xs opacity-70">
                      AI Total: {item.aiEstimatedTotal ? `₹${item.aiEstimatedTotal}` : "—"}
                    </div>
                  </div>

                  <div>
                    <span className={`badge ${riskBadgeClass(item.anomalyRisk)}`}>
                      {item.anomalyRisk}
                    </span>
                  </div>
                </div>

                {Array.isArray(item.anomalyReasons) && item.anomalyReasons.length > 0 && (
                  <ul className="mt-2 text-sm opacity-80 list-disc pl-5">
                    {item.anomalyReasons.map((reason, idx) => (
                      <li key={idx}>{reason}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
=======
import React from "react";
import "../vendor/vendor.css";

export default function AdminDashboard() {
  return (
    <div>
      <div className="v-title">
        <h1>Admin Dashboard</h1>
        <p>Use the sidebar to open the three modules.</p>
      </div>

      
    </div>
  );
}
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
