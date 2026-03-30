import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
} from "react-leaflet";

export default function LiveMap({ agent, destination, path = [] }) {
  if (!agent || !destination) {
    return <div>Waiting for map...</div>;
  }

  return (
    <MapContainer
      center={[agent.lat, agent.lng]}
      zoom={13}
      style={{ height: "300px", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {/* Agent */}
      <Marker position={[agent.lat, agent.lng]} />

      {/* Destination */}
      <Marker position={[destination.lat, destination.lng]} />

      {/* Travel path */}
      {path.length > 1 && (
        <Polyline positions={path.map(p => [p.lat, p.lng])} color="blue" />
      )}

      {/* Remaining path */}
      <Polyline
        positions={[
          [agent.lat, agent.lng],
          [destination.lat, destination.lng],
        ]}
        color="green"
      />
    </MapContainer>
  );
}