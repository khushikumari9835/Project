const KEY = "agent_live_tracking_v1";

function emitUpdate() {
  try {
    window.dispatchEvent(
      new CustomEvent("localdb:update", { detail: { type: "agent-live" } })
    );
  } catch {}
}

function readStore() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "{}");
  } catch {
    return {};
  }
}

function writeStore(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function updateAgentLocation(email, coords) {
  const normalizedEmail = String(email || "").trim().toLowerCase();
  if (!normalizedEmail || !coords) return;

  const lat = Number(coords.lat);
  const lng = Number(coords.lng);

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

  const store = readStore();
  const existing = store[normalizedEmail] || {
    email: normalizedEmail,
    path: [],
  };

  const path = Array.isArray(existing.path) ? [...existing.path] : [];
  const last = path[path.length - 1];

  if (!last || Number(last.lat) !== lat || Number(last.lng) !== lng) {
    path.push({
      lat,
      lng,
      at: new Date().toISOString(),
    });
  }

  store[normalizedEmail] = {
    ...existing,
    location: {
      lat,
      lng,
      accuracy: Number.isFinite(Number(coords.accuracy))
        ? Number(coords.accuracy)
        : null,
      updatedAt: new Date().toISOString(),
    },
    path: path.slice(-40),
  };

  writeStore(store);
  emitUpdate();
}

export function getAgentLocation(email) {
  const normalizedEmail = String(email || "").trim().toLowerCase();
  if (!normalizedEmail) return null;

  const store = readStore();
  return store[normalizedEmail] || null;
}