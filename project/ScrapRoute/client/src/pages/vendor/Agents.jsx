import React, { useEffect, useMemo, useState } from "react";
<<<<<<< HEAD
import axios from "axios";
import {
  loadAgentsByVendor,
  upsertAgent,
} from "../../utils/localDb";
import "./vendor.css";

const API_BASE = "http://localhost:5000/api/auth";

function getCurrentVendor() {
  try {
    const stored = JSON.parse(localStorage.getItem("userInfo") || "{}");
    return stored.user || stored.userInfo || stored;
  } catch {
    return {};
  }
}

const Agents = () => {
  const vendor = useMemo(() => getCurrentVendor(), []);
  const vendorEmail = String(vendor?.email || "").trim().toLowerCase();

  const [agents, setAgents] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
  });

  const refresh = () => setAgents(loadAgentsByVendor(vendorEmail));

  useEffect(() => {
    refresh();
  }, [vendorEmail]);

  useEffect(() => {
    const onLocalDbUpdate = (e) => {
=======
import { loadAgents } from "../../utils/localDb";
import "./vendor.css";

const Agents = () => {
  const [agents, setAgents] = useState([]);
  const [q, setQ] = useState("");

  const refresh = () => setAgents(loadAgents());

  useEffect(() => {
    refresh();
  }, []);

  // ✅ Real-time updates (same tab + cross tab)
  useEffect(() => {
    const onLocalDbUpdate = (e) => {
      // refresh for agent updates (or refresh always)
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
      if (!e?.detail?.type || e.detail.type === "agents") refresh();
    };

    const onStorage = (e) => {
      if (e.key === "scraproute_agents_v1") refresh();
    };

    window.addEventListener("localdb:update", onLocalDbUpdate);
    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener("localdb:update", onLocalDbUpdate);
      window.removeEventListener("storage", onStorage);
    };
<<<<<<< HEAD
  }, [vendorEmail]);
=======
  }, []);
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return agents;

    return agents.filter((a) => {
      const name = (a.name || "").toLowerCase();
      const email = (a.email || "").toLowerCase();
<<<<<<< HEAD
      const address = (a.address || "").toLowerCase();
      return (
        name.includes(term) ||
        email.includes(term) ||
        address.includes(term)
      );
    });
  }, [agents, q]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegisterAgent = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Agent name is required.");
      return;
    }
    if (!formData.email.includes("@")) {
      alert("Enter a valid email.");
      return;
    }
    if (formData.password.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }
    if (!formData.address.trim()) {
      alert("Field agent address/location is required.");
      return;
    }

    const token = vendor?.token || "";
    if (!token) {
      alert("Vendor session not found. Please login again.");
      return;
    }

    setLoading(true);

    try {
      const { data } = await axios.post(
        `${API_BASE}/register-agent`,
        {
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
          address: formData.address.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data?.success && data?.user) {
        upsertAgent({
          id: data.user._id,
          name: data.user.name,
          email: data.user.email,
          role: "field_agent",
          address: data.user.address || formData.address.trim(),
          vendorId: data.user.vendorOwnerId || vendor?._id || vendor?.id || "",
          vendorEmail:
            data.user.vendorOwnerEmail || String(vendorEmail || "").trim().toLowerCase(),
          vendorName: data.user.vendorOwnerName || vendor?.name || "Vendor",
          createdAt: new Date().toISOString(),
        });

        setFormData({
          name: "",
          email: "",
          password: "",
          address: "",
        });

        refresh();
        alert(data.message || "Field agent registered successfully.");
      } else {
        alert("Unable to register field agent.");
      }
    } catch (error) {
      alert(
        error.response?.data?.message || "Field agent registration failed."
      );
    } finally {
      setLoading(false);
    }
  };

=======
      return name.includes(term) || email.includes(term);
    });
  }, [agents, q]);

>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
  return (
    <div>
      <div className="v-title">
        <h1>Agents</h1>
<<<<<<< HEAD
        <p>
          Register and manage only your own field agents. Agents registered under
          another vendor are not visible here.
        </p>
      </div>

      <div className="v-card">
        <div className="v-items-title" style={{ marginBottom: 12 }}>
          Register Field Agent
        </div>

        <form onSubmit={handleRegisterAgent}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 12,
            }}
          >
            <input
              className="input input-bordered w-full text-black"
              name="name"
              placeholder="Field agent name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <input
              className="input input-bordered w-full text-black"
              name="email"
              type="email"
              placeholder="Field agent email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <input
              className="input input-bordered w-full text-black"
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <input
              className="input input-bordered w-full text-black"
              name="address"
              placeholder="Field agent address / location"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>

          <div
            style={{
              marginTop: 12,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <div className="text-xs text-gray-500">
              Vendor: <b>{vendor?.name || "Vendor"}</b> ·{" "}
              {vendor?.email || "—"}
            </div>

            <button className="v-btn-green" type="submit" disabled={loading}>
              {loading ? "Registering..." : "Register Field Agent"}
            </button>
          </div>
        </form>
      </div>

      <div
        className="v-card"
        style={{ display: "flex", gap: 12, alignItems: "center" }}
      >
        <input
          className="input input-bordered w-full text-black"
          placeholder="Search by name, email or address..."
=======
        <p>Registered field agents available for assignment</p>
      </div>

      <div className="v-card" style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <input
          className="input input-bordered w-full text-black"
          placeholder="Search by name or email..."
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button className="v-btn-green" style={{ height: 40 }} onClick={refresh}>
          Refresh
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="v-card text-center text-gray-500 font-bold">
<<<<<<< HEAD
          No field agents found for your vendor account.
          <div className="text-xs text-gray-400 mt-2">
            Register a field agent above to see it here.
=======
          No field agents found.
          <div className="text-xs text-gray-400 mt-2">
            Register a Field Agent account to see it here.
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
          </div>
        </div>
      ) : (
        filtered.map((a) => (
          <div key={a.email} className="v-card">
<<<<<<< HEAD
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <div>
                <div className="v-items-title">{a.name || "Field Agent"}</div>
                <div className="v-meta">
                  <div>
                    <b>Email:</b> {a.email}
                  </div>
                  <div>
                    <b>Role:</b> {a.role || "field_agent"}
                  </div>
                  <div>
                    <b>Address / Location:</b> {a.address || "—"}
                  </div>
                  <div>
                    <b>Registered Under Vendor:</b>{" "}
                    {a.vendorName || vendor?.name || "Vendor"}
                  </div>
                  <div>
                    <b>Registered At:</b>{" "}
                    {a.createdAt
                      ? new Date(a.createdAt).toLocaleString()
                      : "—"}
=======
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
              <div>
                <div className="v-items-title">{a.name || "Field Agent"}</div>
                <div className="v-meta">
                  <div><b>Email:</b> {a.email}</div>
                  <div><b>Role:</b> {a.role || "field_agent"}</div>
                  <div>
                    <b>Registered At:</b>{" "}
                    {a.createdAt ? new Date(a.createdAt).toLocaleString() : "—"}
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center" }}>
                <span className="badge badge-success text-white">Active</span>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

<<<<<<< HEAD
export default Agents;
=======
export default Agents;
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
