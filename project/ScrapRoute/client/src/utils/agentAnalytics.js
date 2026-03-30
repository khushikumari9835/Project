export function calculateAgentPerformance(items = [], agents = []) {
  const agentMap = {};

  agents.forEach((agent) => {
    const email = String(agent.email || "").trim().toLowerCase();

    agentMap[email] = {
      id: agent.id || email,
      name: agent.name || "Field Agent",
      email,
      address: agent.address || "",
      total: 0,
      completed: 0,
      scheduled: 0,
      pending: 0,
      rejected: 0,
      completionRate: 0,
      efficiencyScore: 0,
      avgTurnaroundHours: 0,
      lastAssignedAt: null,
      aiInsight: "",
    };
  });

  items.forEach((item) => {
    const assignedAgentEmail = String(
      item.assignedAgentEmail || item.assignedTo || ""
    )
      .trim()
      .toLowerCase();

    if (!agentMap[assignedAgentEmail]) return;

    const status = String(item.status || "Pending").trim().toLowerCase();
    const agent = agentMap[assignedAgentEmail];

    agent.total += 1;

    if (status === "completed") agent.completed += 1;
    else if (status === "scheduled") agent.scheduled += 1;
    else if (status === "rejected") agent.rejected += 1;
    else agent.pending += 1;

    const assignedAt = item.assignedAt
      ? new Date(item.assignedAt).getTime()
      : null;
    const completedAt = item.completedAt
      ? new Date(item.completedAt).getTime()
      : null;

    if (assignedAt) {
      if (!agent.lastAssignedAt || assignedAt > agent.lastAssignedAt) {
        agent.lastAssignedAt = assignedAt;
      }
    }

    if (assignedAt && completedAt && completedAt > assignedAt) {
      const hours = (completedAt - assignedAt) / (1000 * 60 * 60);
      if (!agent._turnaroundSamples) agent._turnaroundSamples = [];
      agent._turnaroundSamples.push(hours);
    }
  });

  const results = Object.values(agentMap).map((agent) => {
    agent.completionRate =
      agent.total > 0 ? Math.round((agent.completed / agent.total) * 100) : 0;

    if (agent._turnaroundSamples?.length) {
      const avg =
        agent._turnaroundSamples.reduce((sum, x) => sum + x, 0) /
        agent._turnaroundSamples.length;
      agent.avgTurnaroundHours = Number(avg.toFixed(1));
    } else {
      agent.avgTurnaroundHours = 0;
    }

    const completionComponent = agent.completionRate * 0.65;
    const workloadComponent = Math.min(agent.total * 3, 20);
    const pendingPenalty = agent.pending * 3;
    const rejectedPenalty = agent.rejected * 4;
    const speedBonus =
      agent.avgTurnaroundHours > 0
        ? Math.max(0, 15 - agent.avgTurnaroundHours)
        : 0;

    const score =
      completionComponent +
      workloadComponent +
      speedBonus -
      pendingPenalty -
      rejectedPenalty;

    agent.efficiencyScore = Math.max(0, Math.min(100, Math.round(score)));

    if (agent.total === 0) {
      agent.aiInsight = "No pickup history yet. Assign tasks to evaluate performance.";
    } else if (agent.efficiencyScore >= 80) {
      agent.aiInsight =
        "Top performer. Strong completion rate and healthy workload handling.";
    } else if (agent.efficiencyScore >= 60) {
      agent.aiInsight =
        "Stable performer. Can improve by reducing pending pickups and turnaround time.";
    } else if (agent.pending > agent.completed) {
      agent.aiInsight =
        "Risk of backlog. Pending pickups are high compared to completed pickups.";
    } else if (agent.rejected > 0) {
      agent.aiInsight =
        "Attention required. Rejected or unsuccessful assignments are affecting performance.";
    } else {
      agent.aiInsight =
        "Below expected efficiency. Review workload, scheduling discipline and completion speed.";
    }

    delete agent._turnaroundSamples;
    return agent;
  });

  return results.sort((a, b) => b.efficiencyScore - a.efficiencyScore);
}