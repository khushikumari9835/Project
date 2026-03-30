const KEY = "agent_live_tracking";

export const updateAgentLocation = (email, location) => {
  const data = JSON.parse(localStorage.getItem(KEY) || "{}");

  if (!data[email]) {
    data[email] = { path: [] };
  }

  data[email].location = location;

  data[email].path.push(location);
  if (data[email].path.length > 30) {
    data[email].path.shift();
  }

  localStorage.setItem(KEY, JSON.stringify(data));

  window.dispatchEvent(
    new CustomEvent("localdb:update", { detail: { type: "agent-live" } })
  );
};

export const getAgentLocation = (email) => {
  const data = JSON.parse(localStorage.getItem(KEY) || "{}");
  return data[email] || null;
};

export const calculateETA = (agent, dest) => {
  if (!agent || !dest) return null;

  const R = 6371;
  const dLat = (dest.lat - agent.lat) * Math.PI / 180;
  const dLng = (dest.lng - agent.lng) * Math.PI / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(agent.lat * Math.PI / 180) *
    Math.cos(dest.lat * Math.PI / 180) *
    Math.sin(dLng / 2) ** 2;

  const distance = 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const speed = 30; // km/h
  const eta = (distance / speed) * 60;

  return {
    distance: distance.toFixed(2),
    eta: Math.round(eta + 5),
  };
};