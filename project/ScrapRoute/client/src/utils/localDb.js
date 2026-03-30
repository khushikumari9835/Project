const KEY = "scraproute_items_v1";
const AGENTS_KEY = "scraproute_agents_v1";

function notifyDbUpdate(type) {
  try {
    window.dispatchEvent(
      new CustomEvent("localdb:update", { detail: { type } })
    );
  } catch {}
}

/* ===================== ITEMS ===================== */

function ensureId(item) {
  if (item.id) return item;
  return {
    ...item,
    id: `item-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
  };
}

export function loadItems() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || "[]");
    if (!Array.isArray(raw)) return [];
    return raw.map(ensureId);
  } catch {
    return [];
  }
}

export function saveItems(items) {
  const safe = Array.isArray(items) ? items.map(ensureId) : [];
  localStorage.setItem(KEY, JSON.stringify(safe));
  notifyDbUpdate("items");
}

export function addItem(item) {
  const items = loadItems();
  const safeItem = ensureId(item || {});
  items.unshift(safeItem);
  saveItems(items);
  return items;
}

export function updateItem(id, patch) {
  const items = loadItems().map((x) =>
    x.id === id ? ensureId({ ...x, ...patch }) : x
  );
  saveItems(items);
  return items;
}

export function deleteItem(id) {
  const items = loadItems().filter((x) => x.id !== id);
  saveItems(items);
  return items;
}

export function clearItems() {
  saveItems([]);
}

/* ===================== AGENTS ===================== */

export function loadAgents() {
  try {
    const raw = JSON.parse(localStorage.getItem(AGENTS_KEY) || "[]");
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

export function saveAgents(agents) {
  localStorage.setItem(
    AGENTS_KEY,
    JSON.stringify(Array.isArray(agents) ? agents : [])
  );
  notifyDbUpdate("agents");
}

<<<<<<< HEAD
export function loadAgentsByVendor(vendorEmail) {
  const normalizedVendorEmail = String(vendorEmail || "")
    .trim()
    .toLowerCase();

  return loadAgents().filter(
    (a) =>
      String(a.vendorEmail || "")
        .trim()
        .toLowerCase() === normalizedVendorEmail
  );
}

export function getAgentByEmail(email) {
  const normalizedEmail = String(email || "").trim().toLowerCase();
  return (
    loadAgents().find(
      (a) =>
        String(a.email || "").trim().toLowerCase() === normalizedEmail
    ) || null
  );
}

=======
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
export function upsertAgent(agent) {
  if (!agent?.email) return loadAgents();

  const agents = loadAgents();
<<<<<<< HEAD
  const normalizedEmail = String(agent.email).trim().toLowerCase();
  const idx = agents.findIndex(
    (a) => String(a.email || "").trim().toLowerCase() === normalizedEmail
  );

  const existing = idx >= 0 ? agents[idx] : null;

  const existingVendorEmail = String(existing?.vendorEmail || "")
    .trim()
    .toLowerCase();
  const incomingVendorEmail = String(agent.vendorEmail || "")
    .trim()
    .toLowerCase();

  // Prevent agent from being attached to another vendor
  if (
    existing &&
    existingVendorEmail &&
    incomingVendorEmail &&
    existingVendorEmail !== incomingVendorEmail
  ) {
    return agents;
  }
=======
  const idx = agents.findIndex((a) => a.email === agent.email);
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a

  const normalized = {
    id:
      agent.id ||
<<<<<<< HEAD
      existing?.id ||
      `agent-${Math.random().toString(16).slice(2, 8)}`,
    name: agent.name || existing?.name || "Field Agent",
    email: normalizedEmail,
    role: "field_agent",
    address: agent.address || existing?.address || "",
    vendorId: agent.vendorId || existing?.vendorId || "",
    vendorEmail: incomingVendorEmail || existingVendorEmail || "",
    vendorName: agent.vendorName || existing?.vendorName || "",
    createdAt:
      agent.createdAt ||
      existing?.createdAt ||
      new Date().toISOString(),
=======
      (idx >= 0
        ? agents[idx].id
        : `agent-${Math.random().toString(16).slice(2, 8)}`),
    name: agent.name || "Field Agent",
    email: agent.email,
    role: "field_agent",
    createdAt:
      agent.createdAt ||
      (idx >= 0 ? agents[idx].createdAt : new Date().toISOString()),
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
  };

  const next =
    idx >= 0
      ? agents.map((a, i) => (i === idx ? { ...a, ...normalized } : a))
      : [normalized, ...agents];

  saveAgents(next);
  return next;
<<<<<<< HEAD
}
=======
}
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
