import React, { useEffect, useMemo, useState } from "react";
<<<<<<< HEAD
import { loadItems, loadAgentsByVendor, updateItem } from "../../utils/localDb";
=======
import { loadItems, loadAgents, updateItem } from "../../utils/localDb";
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
import "./vendor.css";

function normStatus(s) {
  return String(s || "").trim().toLowerCase();
}
function safe(value, fallback = "—") {
<<<<<<< HEAD
  if (value === undefined || value === null || String(value).trim() === "")
    return fallback;
=======
  if (value === undefined || value === null || String(value).trim() === "") return fallback;
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
  return String(value);
}
function pickupIdFrom(id) {
  const s = String(id || "");
  const tail = s.length >= 5 ? s.slice(-5) : s.padStart(5, "0");
  return `PKP-${tail}`;
}

<<<<<<< HEAD
function getCurrentVendor() {
  try {
    const stored = JSON.parse(localStorage.getItem("userInfo") || "{}");
    return stored.user || stored.userInfo || stored;
  } catch {
    return {};
  }
}

=======
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
export default function Pickups() {
  const [items, setItems] = useState([]);
  const [agents, setAgents] = useState([]);

<<<<<<< HEAD
  const vendor = useMemo(() => getCurrentVendor(), []);
  const vendorEmail = String(vendor?.email || "").trim().toLowerCase();

  const refresh = () => {
    setItems(loadItems());
    setAgents(loadAgentsByVendor(vendorEmail));
=======
  const refresh = () => {
    setItems(loadItems());
    setAgents(loadAgents());
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
  };

  useEffect(() => {
    refresh();

    const onLocal = () => refresh();
    const onStorage = (e) => {
<<<<<<< HEAD
      if (
        e.key === "scraproute_items_v1" ||
        e.key === "scraproute_agents_v1"
      )
        refresh();
=======
      if (e.key === "scraproute_items_v1" || e.key === "scraproute_agents_v1") refresh();
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
    };

    window.addEventListener("localdb:update", onLocal);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("localdb:update", onLocal);
      window.removeEventListener("storage", onStorage);
    };
<<<<<<< HEAD
  }, [vendorEmail]);
=======
  }, []);
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a

  const pickups = useMemo(() => {
    const allowed = new Set(["accepted", "assigned", "scheduled", "completed"]);
    return items.filter((x) => allowed.has(normStatus(x.status)));
  }, [items]);

  const assignAgent = (pickupId, agentEmail) => {
    const agent = agents.find((a) => a.email === agentEmail);
    if (!agent) return;

    const current = items.find((x) => x.id === pickupId);
    if (!current) return;

    const isCompleted = normStatus(current.status) === "completed";

    updateItem(pickupId, {
      assignedAgentEmail: agent.email,
      assignedAgentName: agent.name,
<<<<<<< HEAD
      assignedAgentAddress: agent.address || "",
      assignedAt: new Date().toISOString(),
      vendorName: vendor?.name || "Vendor",
      vendorId: vendor?._id || vendor?.id || "",
=======
      assignedAt: new Date().toISOString(),
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
      status: isCompleted ? "Completed" : "Assigned",
    });
  };

  return (
    <div>
      <div className="v-title">
        <h1>Pickups</h1>
<<<<<<< HEAD
        <p>Assign accepted pickups only to your own field agents.</p>
      </div>

      {pickups.length === 0 ? (
        <div
          className="v-card"
          style={{ textAlign: "center", color: "#6b7280", fontWeight: 800 }}
        >
=======
        <p>Assign accepted pickups to field agents.</p>
      </div>

      {pickups.length === 0 ? (
        <div className="v-card" style={{ textAlign: "center", color: "#6b7280", fontWeight: 800 }}>
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
          No pickups found (Accepted/Assigned/Scheduled/Completed).
        </div>
      ) : (
        pickups.map((x) => (
          <div key={x.id} className="v-card">
            <div className="v-card-grid">
              <div className="v-card-left">
<<<<<<< HEAD
                <div className="v-items-title">
                  {safe(x.title || x.category, "Pickup")}
                </div>

                <ul className="v-ul">
                  <li>
                    <b>Pickup ID:</b> {pickupIdFrom(x.id)}
                  </li>
                  <li>
                    <b>Status:</b> {safe(x.status)}
                  </li>
                  <li>
                    <b>Pickup Address:</b> {safe(x.pickupAddress)}
                  </li>
                  <li>
                    <b>Accepted By:</b> {safe(x.acceptedByVendorName)}
                  </li>
                  <li>
                    <b>Assigned Agent:</b> {safe(x.assignedAgentName, "Not Assigned")}
                  </li>
                  <li>
                    <b>Agent Address:</b> {safe(x.assignedAgentAddress, "—")}
                  </li>
                </ul>

                <div className="v-meta">
                  <div>
                    <b>Assigned At:</b>{" "}
                    {x.assignedAt ? new Date(x.assignedAt).toLocaleString() : "—"}
                  </div>
                </div>
              </div>

              <div
                className="v-actions"
                style={{ flexDirection: "column", alignItems: "stretch" }}
              >
                <div
                  style={{
                    fontWeight: 900,
                    color: "#111827",
                    marginBottom: 8,
                  }}
                >
                  Assign Your Field Agent
=======
                <div className="v-items-title">{safe(x.title || x.category, "Pickup")}</div>

                <ul className="v-ul">
                  <li><b>Pickup ID:</b> {pickupIdFrom(x.id)}</li>
                  <li><b>Status:</b> {safe(x.status)}</li>
                  <li><b>Pickup Address:</b> {safe(x.pickupAddress)}</li>
                  <li><b>Accepted By:</b> {safe(x.acceptedByVendorName)}</li>
                  <li><b>Assigned Agent:</b> {safe(x.assignedAgentName, "Not Assigned")}</li>
                </ul>

                <div className="v-meta">
                  <div><b>Assigned At:</b> {x.assignedAt ? new Date(x.assignedAt).toLocaleString() : "—"}</div>
                </div>
              </div>

              <div className="v-actions" style={{ flexDirection: "column", alignItems: "stretch" }}>
                <div style={{ fontWeight: 900, color: "#111827", marginBottom: 8 }}>
                  Assign Field Agent
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
                </div>

                <select
                  className="input input-bordered w-full text-black"
                  value={x.assignedAgentEmail || ""}
                  onChange={(e) => assignAgent(x.id, e.target.value)}
                  disabled={normStatus(x.status) === "completed"}
                >
<<<<<<< HEAD
                  <option value="">Select your agent…</option>
=======
                  <option value="">Select agent…</option>
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
                  {agents.map((a) => (
                    <option key={a.email} value={a.email}>
                      {a.name} ({a.email})
                    </option>
                  ))}
                </select>
<<<<<<< HEAD

                {agents.length === 0 && (
                  <div className="text-xs text-gray-500 mt-2">
                    No agents registered under your vendor account.
                  </div>
                )}
=======
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
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
