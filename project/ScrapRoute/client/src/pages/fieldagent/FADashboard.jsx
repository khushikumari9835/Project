<<<<<<< HEAD
import React, { useEffect, useMemo, useRef, useState } from "react";
import { loadItems, saveItems, upsertAgent } from "../../utils/localDb";
import { optimizeAgentRoute as fetchOptimizedRoute } from "../../utils/routeApi";
import { updateAgentLocation } from "../../utils/liveTracking";
import LiveMap from "../../components/LiveMap";
=======
import React, { useEffect, useMemo, useState } from "react";
import { loadItems, saveItems, upsertAgent } from "../../utils/localDb";
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a

const TABS = {
  PICKUPS: "PICKUPS",
  ROUTE: "ROUTE",
  PROFILE: "PROFILE",
};

export default function FADashboard() {
  const [tab, setTab] = useState(TABS.PICKUPS);
  const [items, setItems] = useState([]);
<<<<<<< HEAD
  const [routeData, setRouteData] = useState({
    success: false,
    message: "Waiting for live location...",
    stops: [],
    totalDistanceKm: 0,
    estimatedMinutes: 0,
    mapsUrl: null,
  });
  const [routeLoading, setRouteLoading] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [currentLocation, setCurrentLocation] = useState(null);

  const user = getUserFromLS();
  const watchIdRef = useRef(null);
  const optimizeTimerRef = useRef(null);

=======
  const user = getUserFromLS();

  // initial load + register agent in registry
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
  useEffect(() => {
    setItems(loadItems());

    if (user?.email) {
<<<<<<< HEAD
      upsertAgent({
        name: user?.name || "Field Agent",
        email: user.email,
        address: user?.address || "",
      });
    }
  }, [user?.email, user?.name, user?.address]);

  useEffect(() => {
    const refresh = () => setItems(loadItems());

    const onLocal = (e) => {
      if (!e?.detail?.type || e.detail.type === "items") {
        refresh();
      }
    };

    const onStorage = (e) => {
      if (e.key === "scraproute_items_v1") {
        refresh();
      }
=======
      upsertAgent({ name: user?.name || "Field Agent", email: user.email });
    }
  }, [user?.email, user?.name]);

  // ✅ REAL-TIME updates:
  // - localdb:update => same tab updates
  // - storage => other tab updates
  useEffect(() => {
    const onLocal = () => setItems(loadItems());
    const onStorage = (e) => {
      if (e.key === "scraproute_items_v1") setItems(loadItems());
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
    };

    window.addEventListener("localdb:update", onLocal);
    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener("localdb:update", onLocal);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

<<<<<<< HEAD
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported in this browser.");
      setCurrentLocation({
        lat: 28.6139,
        lng: 77.209,
        accuracy: null,
        updatedAt: new Date().toISOString(),
      });
      return;
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const loc = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
          updatedAt: new Date().toISOString(),
        };

        setLocationError("");
        setCurrentLocation(loc);

        if (user?.email) {
          updateAgentLocation(user.email, loc);
        }
      },
      (error) => {
        setLocationError(error.message || "Unable to access current location.");

        const fallback = {
          lat: 28.6139,
          lng: 77.209,
          accuracy: null,
          updatedAt: new Date().toISOString(),
        };

        setCurrentLocation((prev) => prev || fallback);

        if (user?.email) {
          updateAgentLocation(user.email, fallback);
        }
      },
      {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 12000,
      }
    );

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [user?.email]);

  const myPickups = useMemo(() => {
    const myEmail = String(user?.email || "").trim().toLowerCase();
    if (!myEmail) return [];

    return items.filter((x) => {
      const assignedEmail = String(
        x.assignedAgentEmail || x.assignedTo || ""
      )
        .trim()
        .toLowerCase();

      return assignedEmail === myEmail;
    });
  }, [items, user?.email]);

  const assignedActive = useMemo(() => {
    return myPickups.filter((x) => {
      const status = String(x.status || "Assigned").trim().toLowerCase();
      return ["assigned", "pending", "scheduled"].includes(status);
    });
=======
  // ✅ MY assigned pickups (important!)
  const myPickups = useMemo(() => {
    const myEmail = user?.email || "";
    if (!myEmail) return [];

    return items.filter((x) => (x.assignedAgentEmail || "") === myEmail);
  }, [items, user?.email]);

  const assignedActive = useMemo(() => {
    return myPickups.filter((x) =>
      ["Assigned", "Pending", "Scheduled"].includes(x.status || "Assigned")
    );
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
  }, [myPickups]);

  const stats = useMemo(() => {
    return {
      total: myPickups.length,
<<<<<<< HEAD
      pending: myPickups.filter((x) => {
        const status = String(x.status || "Assigned").trim().toLowerCase();
        return ["assigned", "pending"].includes(status);
      }).length,
      scheduled: myPickups.filter(
        (x) => String(x.status || "").trim().toLowerCase() === "scheduled"
      ).length,
      completed: myPickups.filter(
        (x) => String(x.status || "").trim().toLowerCase() === "completed"
      ).length,
=======
      pending: myPickups.filter((x) =>
        ["Assigned", "Pending"].includes(x.status || "Assigned")
      ).length,
      scheduled: myPickups.filter((x) => x.status === "Scheduled").length,
      completed: myPickups.filter((x) => x.status === "Completed").length,
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
    };
  }, [myPickups]);

  const updateStatus = (id, status) => {
    const patch = {
      status,
<<<<<<< HEAD
      assignedAgentEmail: user?.email || "",
      assignedAgentName: user?.name || "Field Agent",
      assignedAgentAddress: user?.address || "",
      ...(status === "Scheduled"
        ? { scheduledAt: new Date().toISOString() }
        : {}),
      ...(status === "Completed"
        ? { completedAt: new Date().toISOString() }
        : {}),
      updatedAt: new Date().toISOString(),
=======
      ...(status === "Scheduled" ? { scheduledAt: new Date().toISOString() } : {}),
      ...(status === "Completed" ? { completedAt: new Date().toISOString() } : {}),
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
    };

    const updated = items.map((x) => (x.id === id ? { ...x, ...patch } : x));
    setItems(updated);
    saveItems(updated);
  };

<<<<<<< HEAD
  const runRouteOptimization = async () => {
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

    if (!assignedActive.length) {
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

    setRouteLoading(true);

    const result = await fetchOptimizedRoute({
      currentLocation,
      pickups: assignedActive.map((x) => ({
        id: x.id,
        title: x.title || x.category || "Pickup",
        category: x.category || "",
        pickupAddress: x.pickupAddress || "",
        status: x.status || "Assigned",
      })),
    });

    setRouteData(result);
    setRouteLoading(false);
  };

  useEffect(() => {
    clearTimeout(optimizeTimerRef.current);

    optimizeTimerRef.current = setTimeout(() => {
      if (tab === TABS.ROUTE) {
        runRouteOptimization();
      }
    }, 500);

    return () => clearTimeout(optimizeTimerRef.current);
  }, [tab, currentLocation, assignedActive]);

=======
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
  const logout = () => {
    localStorage.removeItem("userInfo");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="flex gap-6 items-stretch">
<<<<<<< HEAD
=======
        {/* Sidebar */}
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
        <aside className="w-72 shrink-0 h-[calc(100vh-3rem)]">
          <div className="h-full bg-emerald-700 text-white rounded-2xl shadow-sm border border-emerald-800/20 flex flex-col">
            <div className="p-5 border-b border-white/15">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-white/15 grid place-items-center text-lg">
                  ♻️
                </div>
                <div>
<<<<<<< HEAD
                  <div className="text-lg font-extrabold leading-5">
                    ScrapRoute
                  </div>
=======
                  <div className="text-lg font-extrabold leading-5">ScrapRoute</div>
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
                  <div className="text-xs opacity-90">Field Agent</div>
                </div>
              </div>
            </div>

            <div className="p-4 space-y-2 flex-1">
<<<<<<< HEAD
              <SideBtn
                active={tab === TABS.PICKUPS}
                onClick={() => setTab(TABS.PICKUPS)}
              >
                Assigned Pickups
              </SideBtn>
              <SideBtn
                active={tab === TABS.ROUTE}
                onClick={() => setTab(TABS.ROUTE)}
              >
                Optimised Route
              </SideBtn>
              <SideBtn
                active={tab === TABS.PROFILE}
                onClick={() => setTab(TABS.PROFILE)}
              >
=======
              <SideBtn active={tab === TABS.PICKUPS} onClick={() => setTab(TABS.PICKUPS)}>
                Assigned Pickups
              </SideBtn>
              <SideBtn active={tab === TABS.ROUTE} onClick={() => setTab(TABS.ROUTE)}>
                Optimised Route
              </SideBtn>
              <SideBtn active={tab === TABS.PROFILE} onClick={() => setTab(TABS.PROFILE)}>
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
                Profile
              </SideBtn>
            </div>

            <div className="p-4 border-t border-white/15">
              <div className="rounded-2xl bg-white/10 p-4">
<<<<<<< HEAD
                <div className="text-sm font-bold">
                  {user?.name || "Field Agent"}
                </div>
                <div className="text-xs opacity-90">{user?.email || "—"}</div>
                <div className="text-xs opacity-90 mt-1">
                  Role: FIELD AGENT
                </div>
=======
                <div className="text-sm font-bold">{user?.name || "Agent"}</div>
                <div className="text-xs opacity-90">{user?.email || "—"}</div>
                <div className="text-xs opacity-90 mt-1">Role: FIELD AGENT</div>
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
              </div>

              <button
                onClick={logout}
                className="mt-3 w-full rounded-xl py-2 text-sm font-semibold bg-white/10 hover:bg-white/15 border border-white/20"
              >
                Logout
              </button>
            </div>
          </div>
        </aside>

<<<<<<< HEAD
        <main className="flex-1">
          <div className="flex justify-between items-center mb-6 bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                {tabTitle(tab)}
              </h1>
              <p className="text-slate-500 text-sm">
                Welcome, {user?.name || "Agent"}
              </p>
=======
        {/* Main */}
        <main className="flex-1">
          {/* Header + Dashboard Stats */}
          <div className="flex justify-between items-center mb-6 bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">{tabTitle(tab)}</h1>
              <p className="text-slate-500 text-sm">Welcome, {user?.name || "Agent"}</p>
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
            </div>

            <div className="hidden md:flex gap-3">
              <MiniStat label="Total" value={stats.total} />
              <MiniStat label="Pending" value={stats.pending} />
              <MiniStat label="Scheduled" value={stats.scheduled} />
              <MiniStat label="Completed" value={stats.completed} />
            </div>
          </div>

          {tab === TABS.PICKUPS && (
            <AssignedPickups items={myPickups} onUpdateStatus={updateStatus} />
          )}

<<<<<<< HEAD
          {tab === TABS.ROUTE && (
            <OptimisedRouteCard
              items={assignedActive}
              currentLocation={currentLocation}
              routeData={routeData}
              routeLoading={routeLoading}
              locationError={locationError}
              onRefresh={runRouteOptimization}
            />
          )}
=======
          {tab === TABS.ROUTE && <OptimisedRoute items={assignedActive} />}
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a

          {tab === TABS.PROFILE && <AgentProfile user={user} stats={stats} />}
        </main>
      </div>
    </div>
  );
}

<<<<<<< HEAD
function AssignedPickups({ items, onUpdateStatus }) {
  const active = (items || []).filter(
    (x) => String(x.status || "").trim().toLowerCase() !== "completed"
  );
  const completed = (items || []).filter(
    (x) => String(x.status || "").trim().toLowerCase() === "completed"
  );
=======
/* ===================== Assigned Pickups ===================== */

function AssignedPickups({ items, onUpdateStatus }) {
  const active = (items || []).filter((x) => x.status !== "Completed");
  const completed = (items || []).filter((x) => x.status === "Completed");
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a

  return (
    <Card title="My Assigned Pickups">
      {(items || []).length === 0 ? (
        <Empty text="No pickups assigned to you yet. Ask Vendor to assign pickups." />
      ) : (
        <>
          {active.length > 0 && (
            <div className="space-y-3">
              {active.map((x) => (
                <PickupCard key={x.id} item={x} onUpdateStatus={onUpdateStatus} />
              ))}
            </div>
          )}

          {completed.length > 0 && (
            <div className="pt-6">
<<<<<<< HEAD
              <div className="text-sm font-bold text-slate-700 mb-3">
                Completed
              </div>
=======
              <div className="text-sm font-bold text-slate-700 mb-3">Completed</div>
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
              <div className="space-y-3">
                {completed.map((x) => (
                  <PickupCard key={x.id} item={x} onUpdateStatus={onUpdateStatus} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </Card>
  );
}

function PickupCard({ item, onUpdateStatus }) {
  const title = item.title || item.category || "Pickup";
  const address = item.pickupAddress || "No pickup address provided";
  const status = item.status || "Assigned";

  return (
    <div className="flex justify-between items-start rounded-2xl border border-slate-200 p-4 hover:bg-slate-50">
      <div>
        <div className="font-bold text-slate-800">
          {title} · <span className="text-slate-500">ID: {item.id}</span>
        </div>

        <div className="text-sm text-slate-600 mt-1">📍 {address}</div>

        <div className="text-xs text-slate-500 mt-2 space-y-1">
<<<<<<< HEAD
          <div>Vendor: {item.acceptedByVendorName || item.vendorName || "—"}</div>
          <div>
            Assigned At:{" "}
            {item.assignedAt
              ? new Date(item.assignedAt).toLocaleString()
              : "—"}
          </div>
          <div>
            Scheduled At:{" "}
            {item.scheduledAt
              ? new Date(item.scheduledAt).toLocaleString()
              : "—"}
          </div>
          <div>
            Completed At:{" "}
            {item.completedAt
              ? new Date(item.completedAt).toLocaleString()
              : "—"}
          </div>
=======
          <div>Vendor: {item.acceptedByVendorName || "—"}</div>
          <div>Assigned At: {item.assignedAt ? new Date(item.assignedAt).toLocaleString() : "—"}</div>
          <div>Scheduled At: {item.scheduledAt ? new Date(item.scheduledAt).toLocaleString() : "—"}</div>
          <div>Completed At: {item.completedAt ? new Date(item.completedAt).toLocaleString() : "—"}</div>
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
        </div>
      </div>

      <div className="flex flex-col items-end gap-2">
        <span className={`badge ${badgeClass(status)}`}>{status}</span>

<<<<<<< HEAD
        {String(status).trim().toLowerCase() !== "completed" && (
=======
        {status !== "Completed" && (
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
          <div className="flex gap-2">
            <button
              className="btn btn-xs btn-outline"
              onClick={() => onUpdateStatus(item.id, "Scheduled")}
            >
              Schedule
            </button>
            <button
              className="btn btn-xs btn-success text-white"
              onClick={() => onUpdateStatus(item.id, "Completed")}
            >
              Complete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

<<<<<<< HEAD
function OptimisedRouteCard({
  items,
  currentLocation,
  routeData,
  routeLoading,
  locationError,
  onRefresh,
}) {
  return (
    <Card title="Optimised Route">
      <div className="grid md:grid-cols-3 gap-3">
        <InfoBox label="Assigned Active Pickups" value={items.length} />
        <InfoBox
          label="Current Location"
          value={
            currentLocation
              ? `${currentLocation.lat.toFixed(5)}, ${currentLocation.lng.toFixed(5)}`
              : "Waiting..."
          }
        />
        <InfoBox
          label="Location Accuracy"
          value={
            currentLocation?.accuracy
              ? `${Math.round(currentLocation.accuracy)} m`
              : "—"
          }
        />
      </div>

      {locationError && (
        <div className="rounded-xl border border-red-200 bg-red-50 text-red-700 p-3 text-sm">
          {locationError}
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          className="btn btn-primary"
          onClick={onRefresh}
          disabled={routeLoading || !currentLocation}
        >
          {routeLoading ? "Optimising..." : "Refresh Live Route"}
        </button>

        <button
          className="btn btn-outline"
          onClick={() => {
            if (!items.length) {
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

      <div className="grid md:grid-cols-2 gap-3">
        <InfoBox
          label="Total Distance"
          value={
            routeData?.success ? `${routeData.totalDistanceKm || 0} km` : "—"
          }
        />
        <InfoBox
          label="Estimated Time"
          value={
            routeData?.success ? `${routeData.estimatedMinutes || 0} min` : "—"
          }
        />
      </div>

      {!routeLoading && !routeData?.success && (
        <div className="text-slate-500 text-sm">
          {routeData?.message || "No route available yet."}
        </div>
      )}

      {routeData?.success &&
        routeData.stops?.length > 0 &&
        currentLocation && (
          <LiveMap currentLocation={currentLocation} stops={routeData.stops} />
        )}

      {routeData?.success && routeData.stops?.length > 0 ? (
        <div className="space-y-3">
          {routeData.stops.map((stop, idx) => (
            <div key={stop.id} className="rounded-2xl border border-slate-200 p-3">
              <div className="flex justify-between items-center">
                <div className="font-bold text-slate-800">
                  Stop {idx + 1}: {stop.title}
                </div>
                <div className="text-xs text-slate-500">{stop.status}</div>
              </div>
              <div className="text-sm text-slate-600 mt-1">
                {stop.pickupAddress}
              </div>
              <div className="text-xs text-slate-500 mt-2">
                Distance from previous point: {stop.distanceFromPreviousKm} km
              </div>
            </div>
          ))}
        </div>
      ) : (
        !routeLoading && <Empty text="No route stops available yet." />
=======
/* ===================== Optimised Route ===================== */

function OptimisedRoute({ items }) {
  const stops = (items || [])
    .map((x) => ({
      id: x.id,
      title: x.title || x.category || "Pickup",
      pickupAddress: (x.pickupAddress || "").trim(),
      status: x.status || "Assigned",
    }))
    .filter((x) => x.pickupAddress.length > 0);

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

    if (waypoints.length) url += `&waypoints=${encodeURIComponent(waypoints)}`;

    window.open(url, "_blank");
  };

  return (
    <Card title="Optimised Route">
      {stops.length === 0 ? (
        <Empty text="No valid pickup addresses found for your assigned pickups." />
      ) : (
        <div className="space-y-3">
          {stops.map((s, idx) => (
            <div key={s.id} className="rounded-2xl border border-slate-200 p-3">
              <div className="flex justify-between items-center">
                <div className="font-bold text-slate-800">Stop {idx + 1}: {s.title}</div>
                <div className="text-xs text-slate-500">{s.status}</div>
              </div>
              <div className="text-sm text-slate-600 mt-1">{s.pickupAddress}</div>
            </div>
          ))}
        </div>
      )}

      <button
        className="btn btn-primary mt-5 w-full"
        onClick={openRouteInGoogleMaps}
        disabled={stops.length < 2}
      >
        Open Multi-Stop Route in Google Maps
      </button>

      {stops.length === 1 && (
        <div className="mt-2 text-xs text-slate-500">
          Only 1 stop found. Assign at least 2 pickups to generate a route.
        </div>
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
      )}
    </Card>
  );
}

<<<<<<< HEAD
=======
/* ===================== Profile ===================== */

>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
function AgentProfile({ user, stats }) {
  return (
    <Card title="Profile">
      <div className="space-y-2 text-sm text-slate-700">
<<<<<<< HEAD
        <div>
          <b>Name:</b> {user?.name || "Field Agent"}
        </div>
        <div>
          <b>Email:</b> {user?.email || "—"}
        </div>
        <div>
          <b>Role:</b> FIELD AGENT
        </div>
=======
        <div><b>Name:</b> {user?.name || "Field Agent"}</div>
        <div><b>Email:</b> {user?.email || "—"}</div>
        <div><b>Role:</b> FIELD AGENT</div>
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
      </div>

      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat label="Total" value={stats.total} />
        <Stat label="Pending" value={stats.pending} />
        <Stat label="Scheduled" value={stats.scheduled} />
        <Stat label="Completed" value={stats.completed} />
      </div>
    </Card>
  );
}

<<<<<<< HEAD
=======
/* ===================== UI ===================== */

>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
function Card({ title, children }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
      <h2 className="text-lg font-bold text-slate-800">{title}</h2>
      {children}
    </div>
  );
}

function SideBtn({ active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-xl px-4 py-3 text-sm font-semibold transition ${
        active ? "bg-white/15" : "hover:bg-white/10"
      }`}
    >
      {children}
    </button>
  );
}

function MiniStat({ label, value }) {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-center">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="text-lg font-bold text-slate-800">{value}</div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-center">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="text-lg font-bold text-slate-800">{value}</div>
    </div>
  );
}

<<<<<<< HEAD
function InfoBox({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="text-sm font-bold text-slate-800 mt-1">{value}</div>
    </div>
  );
}

=======
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
function Empty({ text }) {
  return <div className="text-slate-400 italic">{text}</div>;
}

function badgeClass(status) {
<<<<<<< HEAD
  const normalized = String(status || "").trim().toLowerCase();

  if (normalized === "completed") return "badge-success text-white";
  if (normalized === "scheduled") return "badge-info text-white";
=======
  if (status === "Completed") return "badge-success text-white";
  if (status === "Scheduled") return "badge-info text-white";
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
  return "badge-warning";
}

function tabTitle(tab) {
  if (tab === TABS.PICKUPS) return "Assigned Pickups";
  if (tab === TABS.ROUTE) return "Optimised Route";
  return "Profile";
}

function getUserFromLS() {
  try {
    const raw = localStorage.getItem("userInfo");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
<<<<<<< HEAD
    return parsed.user || parsed.userInfo || parsed;
  } catch {
    return null;
  }
}
=======
    return parsed.user || parsed;
  } catch {
    return null;
  }
}
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
