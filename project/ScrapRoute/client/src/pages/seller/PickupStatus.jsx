import { useEffect, useMemo, useState } from "react";
import { loadItems } from "../../utils/localDb";
<<<<<<< HEAD
import { getAgentLocation } from "../../utils/liveTracking";

=======
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a

function badgeClass(status) {
  if (status === "Rejected") return "badge-error";
  if (status === "Scheduled") return "badge-info";
  if (status === "Completed") return "badge-success";
<<<<<<< HEAD
  if (status === "Assigned") return "badge-primary";
  return "badge-warning";
}

function buildMapQuery(selected) {
  const pickupAddress = String(selected?.pickupAddress || "").trim();
  const agentAddress = String(selected?.assignedAgentAddress || "").trim();

  if (pickupAddress) return pickupAddress;
  //if (agentAddress) return agentAddress;

  return "India";
}

function getTimeline(selected) {
  if (!selected) return [];

  const entries = [
    {
      label: "Uploaded",
      at: selected.createdAt,
      done: Boolean(selected.createdAt),
    },
    {
      label: "Accepted / Assigned",
      at: selected.assignedAt,
      done: Boolean(selected.assignedAt),
    },
    {
      label: "Scheduled",
      at: selected.scheduledAt,
      done: Boolean(selected.scheduledAt),
    },
    {
      label: "Completed",
      at: selected.completedAt,
      done: Boolean(selected.completedAt),
    },
  ];

  return entries;
}

export default function PickupStatus() {
  const [items, setItems] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [lastUpdatedAt, setLastUpdatedAt] = useState(Date.now());
  const [agentLive, setAgentLive] = useState(null);

  useEffect(() => {
    const refresh = () => {
      const list = loadItems();
      setItems(list);

      if (!list.length) {
        setSelectedId(null);
      } else if (!list.some((x) => x.id === selectedId)) {
        setSelectedId(list[0].id);
      }

      setLastUpdatedAt(Date.now());
    };

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

    const poll = setInterval(refresh, 2000);

    window.addEventListener("localdb:update", onLocal);
    window.addEventListener("storage", onStorage);

    return () => {
      clearInterval(poll);
      window.removeEventListener("localdb:update", onLocal);
      window.removeEventListener("storage", onStorage);
    };
  }, [selectedId]);

  useEffect(() => {
  if (!selected?.assignedAgentEmail) {
    setAgentLive(null);
    return;
  }

  const update = () => {
    const live = getAgentLocation(selected.assignedAgentEmail);
    setAgentLive(live);
  };

  update();

  window.addEventListener("localdb:update", update);

  return () =>
    window.removeEventListener("localdb:update", update);
}, [selected]);




=======
  return "badge-warning";
}

export default function PickupStatus() {
  const [items, setItems] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    const list = loadItems();
    setItems(list);
    if (list.length > 0) setSelectedId(list[0].id);
  }, []);
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a

  const selected = useMemo(
    () => items.find((x) => x.id === selectedId) || null,
    [items, selectedId]
  );

<<<<<<< HEAD
  const mapQuery = buildMapQuery(selected);
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(
    mapQuery
  )}&z=13&output=embed`;

  const openGoogleMaps = () => {
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        mapQuery
      )}`,
      "_blank"
    );
  };

  const timeline = getTimeline(selected);

=======
  const mapQuery = "BANASTHALI VIDYAPITH NEWAI"; // replace later with pickup location address
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&z=13&output=embed`;

  const openGoogleMaps = () => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`, "_blank");
  };

>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
      {/* Left list */}
      <div className="card bg-base-100 border border-base-300 shadow-sm">
        <div className="card-body">
<<<<<<< HEAD
          <div className="flex items-center justify-between">
            <div className="card-title">Pickup Requests</div>
            <div className="text-xs opacity-60">
              Live refresh · {new Date(lastUpdatedAt).toLocaleTimeString()}
            </div>
          </div>
=======
          <div className="card-title">Pickup Requests</div>
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a

          {items.length === 0 ? (
            <div className="mt-3 text-sm opacity-70">No pickup requests yet.</div>
          ) : (
            <div className="mt-4 space-y-3">
              {items.map((p) => (
                <button
                  key={p.id}
                  className={`w-full text-left rounded-2xl border border-base-300 p-3 transition ${
<<<<<<< HEAD
                    selectedId === p.id
                      ? "bg-emerald-50"
                      : "bg-base-200/40 hover:bg-base-200"
=======
                    selectedId === p.id ? "bg-emerald-50" : "bg-base-200/40 hover:bg-base-200"
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
                  }`}
                  onClick={() => setSelectedId(p.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="font-extrabold">{p.title}</div>
<<<<<<< HEAD
                    <span className={`badge ${badgeClass(p.status)}`}>
                      {p.status}
                    </span>
                  </div>
                  <div className="text-xs opacity-70 mt-1">Pickup ID: {p.id}</div>
                  {p.pickupAddress && (
                    <div className="text-xs opacity-60 mt-1">
                      Address: {p.pickupAddress}
                    </div>
                  )}
=======
                    <span className={`badge ${badgeClass(p.status)}`}>{p.status}</span>
                  </div>
                  <div className="text-xs opacity-70 mt-1">Pickup ID: {p.id}</div>
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right tracking */}
      <div className="card bg-base-100 border border-base-300 shadow-sm">
        <div className="card-body">
<<<<<<< HEAD
          <div className="flex items-center justify-between">
            <div className="card-title">Track Your Pickup</div>
            <div className="text-xs text-success font-semibold">Real-time</div>
          </div>

          {!selected ? (
            <div className="mt-3 text-sm opacity-70">
              Select a pickup request to track.
            </div>
=======
          <div className="card-title">Track Your Pickup</div>

          {!selected ? (
            <div className="mt-3 text-sm opacity-70">Select a pickup request to track.</div>
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
          ) : (
            <>
              <div className="rounded-2xl overflow-hidden border border-base-300 h-56">
                <iframe
                  title="pickup-map"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src={mapSrc}
                />
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-extrabold">{selected.title}</div>
<<<<<<< HEAD
                  <span className={`badge ${badgeClass(selected.status)}`}>
                    {selected.status}
                  </span>
                </div>

                <div className="text-sm opacity-70">Pickup ID: {selected.id}</div>

                <div className="text-sm opacity-70">
                  Pickup Address: {selected.pickupAddress || "—"}
                </div>

                <div className="text-sm opacity-70">
                  Assigned Agent: {selected.assignedAgentName || "Not assigned yet"}
                </div>

                <div className="text-sm opacity-70">
                  Agent Address: {selected.assignedAgentAddress || "—"}
                </div>

                <div className="text-sm opacity-70">
                  Vendor: {selected.vendorName || selected.acceptedByVendorName || "—"}
                </div>

                {agentLive?.location && (
                <div className="rounded-xl border border-green-200 bg-green-50 p-3 mt-2">
                  <div className="text-sm font-semibold text-green-700">
                    📍 Live Agent Location
                  </div>
                  <div className="text-sm text-green-800">
                    Lat: {agentLive.location.lat.toFixed(5)} <br />
                    Lng: {agentLive.location.lng.toFixed(5)}
                  </div>
                </div>
              )}


                

                <div className="divider my-2">Live Progress</div>

                <div className="space-y-3">
                  {timeline.map((step) => (
                    <div
                      key={step.label}
                      className="flex items-start gap-3 rounded-xl border border-base-300 bg-base-200/30 p-3"
                    >
                      <div
                        className={`mt-1 h-3 w-3 rounded-full ${
                          step.done ? "bg-success" : "bg-base-300"
                        }`}
                      />
                      <div>
                        <div className="font-semibold">{step.label}</div>
                        <div className="text-xs opacity-60">
                          {step.at ? new Date(step.at).toLocaleString() : "Waiting..."}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button className="btn btn-primary mt-4 w-full" onClick={openGoogleMaps}>
                Track on Google Maps
=======
                  <span className={`badge ${badgeClass(selected.status)}`}>{selected.status}</span>
                </div>
                <div className="text-sm opacity-70">Pickup ID: {selected.id}</div>
              </div>

              <button className="btn btn-primary mt-4 w-full" onClick={openGoogleMaps}>
                Track
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
              </button>
            </>
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
