import { useEffect, useMemo, useState } from "react";
import { loadAgentsByVendor, loadItems } from "../../utils/localDb";
import { calculateAgentPerformance } from "../../utils/agentAnalytics";
import "./vendor.css";

function getCurrentVendor() {
  try {
    const stored = JSON.parse(localStorage.getItem("userInfo") || "{}");
    return stored.user || stored.userInfo || stored;
  } catch {
    return {};
  }
}

function scoreColor(score) {
  if (score >= 80) return "#16a34a";
  if (score >= 60) return "#f59e0b";
  return "#dc2626";
}

function MetricCard({ label, value, accent }) {
  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 16,
        padding: 16,
        background: "#fff",
      }}
    >
      <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 6 }}>
        {label}
      </div>
      <div
        style={{
          fontSize: 24,
          fontWeight: 800,
          color: accent || "#111827",
        }}
      >
        {value}
      </div>
    </div>
  );
}

function Bar({ label, value, max, color = "#2563eb" }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;

  return (
    <div style={{ marginBottom: 14 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 13,
          marginBottom: 6,
        }}
      >
        <span style={{ color: "#374151", fontWeight: 600 }}>{label}</span>
        <span style={{ color: "#6b7280" }}>{value}</span>
      </div>
      <div
        style={{
          height: 10,
          background: "#e5e7eb",
          borderRadius: 999,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            background: color,
            borderRadius: 999,
          }}
        />
      </div>
    </div>
  );
}

export default function AgentAnalytics() {
  const vendor = useMemo(() => getCurrentVendor(), []);
  const vendorEmail = String(vendor?.email || "").trim().toLowerCase();

  const [agents, setAgents] = useState([]);
  const [analytics, setAnalytics] = useState([]);
  const [selectedAgentEmail, setSelectedAgentEmail] = useState("");

  const refresh = () => {
    const vendorAgents = loadAgentsByVendor(vendorEmail);
    const items = loadItems();
    const perf = calculateAgentPerformance(items, vendorAgents);

    setAgents(vendorAgents);
    setAnalytics(perf);

    if (vendorAgents.length > 0) {
      const currentExists = vendorAgents.some(
        (a) =>
          String(a.email || "").trim().toLowerCase() ===
          String(selectedAgentEmail || "").trim().toLowerCase()
      );

      if (!currentExists) {
        setSelectedAgentEmail(
          String(vendorAgents[0].email || "").trim().toLowerCase()
        );
      }
    } else {
      setSelectedAgentEmail("");
    }
  };

  useEffect(() => {
    refresh();

    const onLocal = (e) => {
      if (
        !e?.detail?.type ||
        e.detail.type === "items" ||
        e.detail.type === "agents"
      ) {
        refresh();
      }
    };

    const onStorage = (e) => {
      if (
        e.key === "scraproute_items_v1" ||
        e.key === "scraproute_agents_v1"
      ) {
        refresh();
      }
    };

    window.addEventListener("localdb:update", onLocal);
    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener("localdb:update", onLocal);
      window.removeEventListener("storage", onStorage);
    };
  }, [vendorEmail]);

  const selectedAgent = analytics.find(
    (a) =>
      String(a.email || "").trim().toLowerCase() ===
      String(selectedAgentEmail || "").trim().toLowerCase()
  );

  const leaderboard = useMemo(() => analytics.slice(0, 5), [analytics]);

  const comparisonMax = useMemo(() => {
    if (!analytics.length) {
      return { total: 1, completed: 1, pending: 1, score: 1 };
    }

    return {
      total: Math.max(...analytics.map((a) => a.total), 1),
      completed: Math.max(...analytics.map((a) => a.completed), 1),
      pending: Math.max(...analytics.map((a) => a.pending), 1),
      score: Math.max(...analytics.map((a) => a.efficiencyScore), 1),
    };
  }, [analytics]);

  return (
    <div>
      <div className="v-title">
        <h1>Agent Analytics</h1>
        <p>
          Review individual field-agent performance, compare agents, and view
          AI-generated performance insights.
        </p>
      </div>

      <div className="v-card">
        <div className="v-items-title" style={{ marginBottom: 12 }}>
          Select Agent
        </div>

        {agents.length === 0 ? (
          <div className="text-gray-500 font-semibold">
            No field agents registered under your vendor account yet.
          </div>
        ) : (
          <select
            className="input input-bordered w-full text-black"
            value={selectedAgentEmail}
            onChange={(e) => setSelectedAgentEmail(e.target.value)}
          >
            {agents.map((agent) => (
              <option key={agent.email} value={agent.email}>
                {agent.name} ({agent.email})
              </option>
            ))}
          </select>
        )}
      </div>

      {selectedAgent && (
        <>
          <div className="v-card">
            <div className="v-items-title" style={{ marginBottom: 14 }}>
              Selected Agent Overview
            </div>

            <div className="v-meta" style={{ marginBottom: 16 }}>
              <div>
                <b>Name:</b> {selectedAgent.name}
              </div>
              <div>
                <b>Email:</b> {selectedAgent.email}
              </div>
              <div>
                <b>Address / Location:</b> {selectedAgent.address || "—"}
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: 12,
              }}
            >
              <MetricCard label="Total Pickups" value={selectedAgent.total} />
              <MetricCard
                label="Completed"
                value={selectedAgent.completed}
                accent="#16a34a"
              />
              <MetricCard
                label="Scheduled"
                value={selectedAgent.scheduled}
                accent="#2563eb"
              />
              <MetricCard
                label="Pending"
                value={selectedAgent.pending}
                accent="#f59e0b"
              />
              <MetricCard
                label="Completion Rate"
                value={`${selectedAgent.completionRate}%`}
              />
              <MetricCard
                label="Efficiency Score"
                value={selectedAgent.efficiencyScore}
                accent={scoreColor(selectedAgent.efficiencyScore)}
              />
            </div>
          </div>

          <div className="v-card">
            <div className="v-items-title" style={{ marginBottom: 12 }}>
              Performance Charts
            </div>

            <Bar
              label="Total Pickups"
              value={selectedAgent.total}
              max={Math.max(selectedAgent.total, 1)}
              color="#334155"
            />
            <Bar
              label="Completed"
              value={selectedAgent.completed}
              max={Math.max(selectedAgent.total, 1)}
              color="#16a34a"
            />
            <Bar
              label="Scheduled"
              value={selectedAgent.scheduled}
              max={Math.max(selectedAgent.total, 1)}
              color="#2563eb"
            />
            <Bar
              label="Pending"
              value={selectedAgent.pending}
              max={Math.max(selectedAgent.total, 1)}
              color="#f59e0b"
            />
            <Bar
              label="Efficiency Score"
              value={selectedAgent.efficiencyScore}
              max={100}
              color={scoreColor(selectedAgent.efficiencyScore)}
            />
          </div>

          <div className="v-card">
            <div className="v-items-title" style={{ marginBottom: 12 }}>
              AI Insights
            </div>

            <div
              style={{
                border: "1px solid #dbeafe",
                background: "#eff6ff",
                borderRadius: 14,
                padding: 16,
                color: "#1e3a8a",
                fontWeight: 600,
              }}
            >
              {selectedAgent.aiInsight}
            </div>

            <div
              style={{
                marginTop: 14,
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 12,
              }}
            >
              <div
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: 14,
                  padding: 14,
                  background: "#fff",
                }}
              >
                <div style={{ fontSize: 12, color: "#6b7280" }}>
                  Turnaround Benchmark
                </div>
                <div style={{ fontWeight: 800, marginTop: 6 }}>
                  {selectedAgent.avgTurnaroundHours > 0
                    ? `${selectedAgent.avgTurnaroundHours} hrs avg`
                    : "No completed pickup timing yet"}
                </div>
              </div>

              <div
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: 14,
                  padding: 14,
                  background: "#fff",
                }}
              >
                <div style={{ fontSize: 12, color: "#6b7280" }}>
                  Performance Category
                </div>
                <div
                  style={{
                    fontWeight: 800,
                    marginTop: 6,
                    color: scoreColor(selectedAgent.efficiencyScore),
                  }}
                >
                  {selectedAgent.efficiencyScore >= 80
                    ? "High Performer"
                    : selectedAgent.efficiencyScore >= 60
                    ? "Stable Performer"
                    : "Needs Attention"}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="v-card">
        <div className="v-items-title" style={{ marginBottom: 12 }}>
          Agent Leaderboard
        </div>

        {leaderboard.length === 0 ? (
          <div className="text-gray-500 font-semibold">
            No analytics data available yet.
          </div>
        ) : (
          leaderboard.map((agent, index) => (
            <div
              key={agent.email}
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: 14,
                padding: 14,
                marginBottom: 10,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 12,
                background: "#fff",
              }}
            >
              <div>
                <div style={{ fontWeight: 800 }}>
                  #{index + 1} · {agent.name}
                </div>
                <div style={{ fontSize: 13, color: "#6b7280" }}>
                  Completed {agent.completed}/{agent.total} · Completion{" "}
                  {agent.completionRate}%
                </div>
              </div>

              <div
                style={{
                  fontWeight: 900,
                  color: scoreColor(agent.efficiencyScore),
                  fontSize: 18,
                }}
              >
                {agent.efficiencyScore}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="v-card">
        <div className="v-items-title" style={{ marginBottom: 12 }}>
          Agent Performance Comparison
        </div>

        {analytics.length === 0 ? (
          <div className="text-gray-500 font-semibold">
            No comparison data available.
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Agent</th>
                  <th>Total</th>
                  <th>Completed</th>
                  <th>Scheduled</th>
                  <th>Pending</th>
                  <th>Completion %</th>
                  <th>Efficiency</th>
                </tr>
              </thead>
              <tbody>
                {analytics.map((agent) => (
                  <tr key={agent.email}>
                    <td>
                      <div style={{ fontWeight: 700 }}>{agent.name}</div>
                      <div style={{ fontSize: 12, color: "#6b7280" }}>
                        {agent.email}
                      </div>
                    </td>
                    <td>{agent.total}</td>
                    <td>{agent.completed}</td>
                    <td>{agent.scheduled}</td>
                    <td>{agent.pending}</td>
                    <td>{agent.completionRate}%</td>
                    <td>
                      <div style={{ minWidth: 140 }}>
                        <Bar
                          label=""
                          value={agent.efficiencyScore}
                          max={comparisonMax.score}
                          color={scoreColor(agent.efficiencyScore)}
                        />
                        <div
                          style={{
                            marginTop: -4,
                            fontWeight: 800,
                            color: scoreColor(agent.efficiencyScore),
                          }}
                        >
                          {agent.efficiencyScore}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}