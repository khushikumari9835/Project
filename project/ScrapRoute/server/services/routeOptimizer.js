const fs = require("fs");
const path = require("path");

const CACHE_DIR = path.join(__dirname, "../cache");
const CACHE_FILE = path.join(CACHE_DIR, "geocodeCache.json");

function ensureCacheFile() {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
  if (!fs.existsSync(CACHE_FILE)) {
    fs.writeFileSync(CACHE_FILE, JSON.stringify({}, null, 2));
  }
}

function readCache() {
  try {
    ensureCacheFile();
    return JSON.parse(fs.readFileSync(CACHE_FILE, "utf8"));
  } catch {
    return {};
  }
}

function writeCache(cache) {
  try {
    ensureCacheFile();
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
  } catch (error) {
    console.error("Failed to write geocode cache:", error.message);
  }
}

function normalizeAddress(address) {
  return String(address || "").trim().toLowerCase();
}

async function geocodeAddress(address) {
  const clean = String(address || "").trim();
  if (!clean) return null;

  const key = normalizeAddress(clean);
  const cache = readCache();

  if (cache[key]) {
    return cache[key];
  }

  const url =
    `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=` +
    encodeURIComponent(clean);

  const response = await fetch(url, {
    headers: {
      "User-Agent": "ScrapRoute/1.0 (route optimization)",
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Geocoding failed with status ${response.status}`);
  }

  const results = await response.json();
  if (!Array.isArray(results) || results.length === 0) {
    return null;
  }

  const first = results[0];
  const point = {
    lat: Number(first.lat),
    lng: Number(first.lon),
    displayName: first.display_name || clean,
  };

  cache[key] = point;
  writeCache(cache);

  return point;
}

function toRadians(value) {
  return (value * Math.PI) / 180;
}

function haversineKm(a, b) {
  const R = 6371;
  const dLat = toRadians(b.lat - a.lat);
  const dLng = toRadians(b.lng - a.lng);

  const lat1 = toRadians(a.lat);
  const lat2 = toRadians(b.lat);

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;

  return 2 * R * Math.asin(Math.sqrt(h));
}

function buildGoogleMapsUrl(origin, orderedStops) {
  if (!origin || !orderedStops || orderedStops.length === 0) return null;

  const format = (p) => `${p.lat},${p.lng}`;
  const originStr = format(origin);

  if (orderedStops.length === 1) {
    const destination = format(orderedStops[0].coords);
    const url =
      `https://www.google.com/maps/dir/?api=1` +
      `&origin=${encodeURIComponent(originStr)}` +
      `&destination=${encodeURIComponent(destination)}` +
      `&travelmode=driving`;

    console.log("GOOGLE MAP URL:", url);
    return url;
  }

  const destination = format(orderedStops[orderedStops.length - 1].coords);
  const waypoints = orderedStops
    .slice(0, -1)
    .map((s) => format(s.coords))
    .join("|");

  let url =
    `https://www.google.com/maps/dir/?api=1` +
    `&origin=${encodeURIComponent(originStr)}` +
    `&destination=${encodeURIComponent(destination)}` +
    `&travelmode=driving`;

  if (waypoints) {
    url += `&waypoints=${encodeURIComponent(waypoints)}`;
  }

  console.log("GOOGLE MAP URL:", url);
  return url;
}

async function optimizeRoute({ currentLocation, pickups }) {
  if (
    !currentLocation ||
    !Number.isFinite(Number(currentLocation.lat)) ||
    !Number.isFinite(Number(currentLocation.lng))
  ) {
    return {
      success: false,
      message: "Current location is required for real-time optimization.",
      stops: [],
      totalDistanceKm: 0,
      estimatedMinutes: 0,
      mapsUrl: null,
    };
  }

  const validPickups = Array.isArray(pickups)
    ? pickups.filter((x) => String(x.pickupAddress || "").trim().length > 0)
    : [];

  if (!validPickups.length) {
    return {
      success: false,
      message: "No assigned or scheduled pickups with valid pickup address found.",
      stops: [],
      totalDistanceKm: 0,
      estimatedMinutes: 0,
      mapsUrl: null,
    };
  }

  const geocodedStops = [];
  for (const pickup of validPickups) {
    try {
      const coords = await geocodeAddress(pickup.pickupAddress);
      if (coords) {
        geocodedStops.push({
          id: pickup.id,
          title: pickup.title || pickup.category || "Pickup",
          pickupAddress: pickup.pickupAddress,
          status: pickup.status || "Assigned",
          coords,
        });
      }
    } catch (error) {
      console.error(
        `Geocoding failed for "${pickup.pickupAddress}":`,
        error.message
      );
    }
  }

  if (!geocodedStops.length) {
    return {
      success: false,
      message: "Unable to geocode any assigned pickup address.",
      stops: [],
      totalDistanceKm: 0,
      estimatedMinutes: 0,
      mapsUrl: null,
    };
  }

  const remaining = [...geocodedStops];
  const ordered = [];
  let cursor = {
    lat: Number(currentLocation.lat),
    lng: Number(currentLocation.lng),
  };

  while (remaining.length) {
    let bestIndex = 0;
    let bestDistance = Infinity;

    remaining.forEach((stop, idx) => {
      const distance = haversineKm(cursor, stop.coords);
      if (distance < bestDistance) {
        bestDistance = distance;
        bestIndex = idx;
      }
    });

    const next = remaining.splice(bestIndex, 1)[0];
    ordered.push({
      ...next,
      distanceFromPreviousKm: Number(bestDistance.toFixed(2)),
    });
    cursor = next.coords;
  }

  const totalDistanceKm = Number(
    ordered
      .reduce((sum, stop) => sum + stop.distanceFromPreviousKm, 0)
      .toFixed(2)
  );

  const averageCitySpeedKmph = 28;
  const estimatedMinutes = Math.max(
    1,
    Math.round((totalDistanceKm / averageCitySpeedKmph) * 60)
  );

  const mapsUrl = buildGoogleMapsUrl(currentLocation, ordered);

  return {
    success: true,
    message: "Route optimized successfully.",
    totalDistanceKm,
    estimatedMinutes,
    mapsUrl,
    stops: ordered,
  };
}

module.exports = {
  optimizeRoute,
};