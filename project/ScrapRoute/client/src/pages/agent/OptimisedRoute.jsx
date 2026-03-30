<<<<<<< HEAD
import { useEffect, useMemo, useRef, useState } from "react";
import { loadItems } from "../../utils/localDb";
import { getUser } from "../../utils/role";
import { optimizeAgentRoute } from "../../utils/routeApi";
import LiveMap from "../../components/LiveMap";

export default function OptimisedRoute() {
  const [items, setItems] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [routeData, setRouteData] = useState({
    success: false,
    message: "Waiting for live location...",
    stops: [],
    totalDistanceKm: 0,
    estimatedMinutes: 0,
    mapsUrl: null,
  });
  const [loading, setLoading] = useState(false);
  const [locationError, setLocationError] = useState("");

  const user = getUser();
  const watchIdRef = useRef(null);

  useEffect(() => {
    const refresh = () => setItems(loadItems());

    refresh();

    const onLocal = (e) => {
      if (!e?.detail?.type || e.detail.type === "items") {
        refresh();
      }
    };

    const onStorage = (e) => {
      if (e.key === "scraproute_items_v1") {
        refresh();
      }
    };

    window.addEventListener("localdb:update", onLocal);
    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener("localdb:update", onLocal);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation not supported.");
      setCurrentLocation({
        lat: 28.6139,
        lng: 77.209,
        accuracy: null,
      });
      return;
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        setLocationError("");
        setCurrentLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        });
      },
      (err) => {
        setLocationError(err.message || "Unable to access current location.");
        setCurrentLocation((prev) =>
          prev || {
            lat: 28.6139,
            lng: 77.209,
            accuracy: null,
          }
        );
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 12000 }
    );

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  const pickups = useMemo(() => {
    const email = String(user?.email || "").trim().toLowerCase();

    return items
      .filter((x) => {
        const assigned = String(x.assignedAgentEmail || x.assignedTo || "")
          .trim()
          .toLowerCase();

        return assigned === email;
      })
      .filter((x) => {
        const status = String(x.status || "Assigned").trim().toLowerCase();
        return ["assigned", "pending", "scheduled"].includes(status);
=======
import { useEffect, useMemo, useState } from "react";
import { loadItems } from "../../utils/localDb";
import { getUser } from "../../utils/role";

export default function OptimisedRoute() {
  const [items, setItems] = useState([]);
  const user = getUser();

  useEffect(() => {
    setItems(loadItems());
  }, []);

  const stops = useMemo(() => {
    const myEmail = user?.email || "";

    return items
      .filter((x) => {
        // ✅ Only my assigned pickups
        if (!myEmail) return false;
        if ((x.assignedAgentEmail || "") !== myEmail) return false;

        // ✅ statuses you want to drive to
        const st = x.status || "Assigned";
        return ["Assigned", "Pending", "Scheduled"].includes(st);
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
      })
      .map((x) => ({
        id: x.id,
        title: x.title || x.category || "Pickup",
        pickupAddress: x.pickupAddress || "",
        status: x.status || "Assigned",
      }))
      .filter((x) => x.pickupAddress.trim().length > 0);
  }, [items, user?.email]);

<<<<<<< HEAD
  const refreshRoute = async () => {
    if (!currentLocation) {
      setRouteData({
        success: false,
        message: "Waiting for live location...",
        stops: [],
        totalDistanceKm: 0,
        estimatedMinutes: 0,
        mapsUrl: null,
      });
      return;
    }

    if (!pickups.length) {
      setRouteData({
        success: false,
        message: "No assigned or scheduled pickups available for routing.",
        stops: [],
        totalDistanceKm: 0,
        estimatedMinutes: 0,
        mapsUrl: null,
      });
      return;
    }

    setLoading(true);
    const result = await optimizeAgentRoute({
      currentLocation,
      pickups,
    });
    setRouteData(result);
    setLoading(false);
  };

  useEffect(() => {
    if (currentLocation && pickups.length) {
      refreshRoute();
    }
  }, [currentLocation, pickups.length]);

=======
  const openRouteInGoogleMaps = () => {
    if (stops.length < 2) {
      alert("Need at least 2 pickup addresses to create a route.");
      return;
    }

    const origin = stops[0].pickupAddress;
    const destination = stops[stops.length - 1].pickupAddress;
    const waypoints = stops.slice(1, -1).map((s) => s.pickupAddress).join("|");

    let url =
      `https://www.google.com/maps/dir/?api=1` +
      `&origin=${encodeURIComponent(origin)}` +
      `&destination=${encodeURIComponent(destination)}` +
      `&travelmode=driving`;

    if (waypoints.length > 0) {
      url += `&waypoints=${encodeURIComponent(waypoints)}`;
    }

    window.open(url, "_blank");
  };

>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
  return (
    <div className="space-y-6">
      <div>
        <div className="text-2xl font-extrabold">Optimised Route</div>
        <div className="text-sm opacity-70">
<<<<<<< HEAD
          Real-time route optimization for pickups assigned to you.
        </div>
      </div>

      {locationError && (
        <div className="rounded-xl border border-red-200 bg-red-50 text-red-700 p-3 text-sm">
          {locationError}
        </div>
      )}

      <div className="card bg-base-100 border border-base-300 shadow-sm">
        <div className="card-body">
          <div className="card-title">Stops ({routeData?.stops?.length || 0})</div>

          <div className="grid md:grid-cols-3 gap-3">
            <div className="rounded-xl border border-base-300 p-3">
              <div className="text-xs opacity-70">Current Location</div>
              <div className="font-bold">
                {currentLocation
                  ? `${currentLocation.lat.toFixed(5)}, ${currentLocation.lng.toFixed(5)}`
                  : "Waiting..."}
              </div>
            </div>

            <div className="rounded-xl border border-base-300 p-3">
              <div className="text-xs opacity-70">Total Distance</div>
              <div className="font-bold">
                {routeData?.success ? `${routeData.totalDistanceKm || 0} km` : "—"}
              </div>
            </div>

            <div className="rounded-xl border border-base-300 p-3">
              <div className="text-xs opacity-70">ETA</div>
              <div className="font-bold">
                {routeData?.success ? `${routeData.estimatedMinutes || 0} min` : "—"}
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              className="btn btn-primary"
              onClick={refreshRoute}
              disabled={loading || !currentLocation}
            >
              {loading ? "Optimising..." : "Refresh Live Route"}
            </button>

            <button
              className="btn btn-outline"
              onClick={() => {
                if (!pickups.length) {
                  alert("No assigned or scheduled pickups available.");
                  return;
                }

                const url = routeData?.mapsUrl;
                if (!url || !url.startsWith("http")) {
                  alert("Route not ready. Please refresh route.");
                  return;
                }

                window.open(url, "_blank", "noopener,noreferrer");
              }}
            >
              Open in Google Maps
            </button>
          </div>

          {routeData?.success &&
            routeData.stops?.length > 0 &&
            currentLocation && (
              <LiveMap currentLocation={currentLocation} stops={routeData.stops} />
            )}

          {routeData?.success && routeData.stops?.length > 0 ? (
            <div className="mt-4 space-y-3">
              {routeData.stops.map((s, idx) => (
=======
          Generates Google Maps route for pickups assigned to you.
        </div>
      </div>

      <div className="card bg-base-100 border border-base-300 shadow-sm">
        <div className="card-body">
          <div className="card-title">Stops ({stops.length})</div>

          {stops.length === 0 ? (
            <div className="mt-3 text-sm opacity-70">
              No assigned pickups with valid pickup address found.
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {stops.map((s, idx) => (
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
                <div
                  key={s.id}
                  className="rounded-2xl border border-base-300 bg-base-200/40 p-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="font-extrabold">
                      Stop {idx + 1}: {s.title}
                    </div>
                    <div className="text-xs opacity-70">{s.status}</div>
                  </div>
                  <div className="text-sm opacity-80 mt-1">{s.pickupAddress}</div>
<<<<<<< HEAD
                  <div className="text-xs opacity-60 mt-2">
                    Distance from previous point: {s.distanceFromPreviousKm} km
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-3 text-sm opacity-70">
              {routeData?.message ||
                "No assigned pickups with valid pickup address found."}
=======
                </div>
              ))}
            </div>
          )}

          <button
            className="btn btn-primary mt-5 w-full"
            onClick={openRouteInGoogleMaps}
            disabled={stops.length < 2}
            title={stops.length < 2 ? "Need at least 2 stops for a route" : ""}
          >
            Open Multi-Stop Route in Google Maps
          </button>

          {stops.length === 1 && (
            <div className="mt-2 text-xs opacity-60">
              Only 1 stop found. Assign at least 2 pickups to generate a route.
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
            </div>
          )}
        </div>
      </div>
    </div>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
