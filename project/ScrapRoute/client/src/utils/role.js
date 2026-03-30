export function getUser() {
  try {
    const stored = JSON.parse(localStorage.getItem("userInfo") || "{}");
    return stored.user || stored.userInfo || stored;
  } catch {
    return null;
  }
}

/**
 * Normalizes role values stored in localStorage into one of:
 * USER | VENDOR | FIELD_AGENT | ADMIN
 *
 * Your app stores roles as: user, vendor, field_agent.
 * This function also handles common variants to prevent mismatches.
 */
export function getRole() {
  const u = getUser();

  // pick any role-like field your project might store
  const raw =
    u?.role ??
    u?.category ??
    u?.userType ??
    "USER";

  const norm = String(raw)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")     // "field agent" -> "field_agent"
    .replace(/-+/g, "_");     // "field-agent" -> "field_agent"

  // map common variants to your canonical roles
  if (norm === "vendor") return "VENDOR";
  if (norm === "field_agent" || norm === "agent" || norm === "fieldagent") return "FIELD_AGENT";
  if (norm === "admin" || norm === "administrator") return "ADMIN";

  // treat seller/customer as USER in your project
  if (norm === "user" || norm === "seller" || norm === "customer") return "USER";

  // fallback: uppercase any unknown role, but keep it safe
  return norm.toUpperCase();
}
