import { MapContainer, TileLayer, useMap } from "react-leaflet";
import type { User } from "../../types/User";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet.markercluster";

import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface UserMapProps {
  users: User[];
  filter: string;
}

function MarkersLayer({ users, filter }: UserMapProps) {
  const map = useMap();

  console.log("MarkersLayer: users count =", users.length, "filter =", filter);

  useEffect(() => {
    console.log("Creating marker cluster");

    const markerCluster = L.markerClusterGroup({
      chunkedLoading: true,
      maxClusterRadius: 80,
    });

    const filteredUsers = users.filter((user) => {
      if (!filter) return true;
      return user.interests.some((interest) =>
        interest.toLowerCase().includes(filter.toLowerCase())
      );
    });

    console.log("Filtered users count:", filteredUsers.length);

    filteredUsers.forEach((user) => {
      const marker = L.marker([user.lat, user.lon]);

      marker.bindPopup(`
        <div style="min-width: 200px;">
          <strong>${user.name}</strong><br/>
          <em>${user.interests.join(", ")}</em>
        </div>
      `);

      markerCluster.addLayer(marker);
    });

    map.addLayer(markerCluster);

    console.log("Marker cluster added to map");

    return () => {
      map.removeLayer(markerCluster);
    };
  }, [map, users, filter]);

  return null;
}

const UserMap = ({ users, filter }: UserMapProps) => {
  return (
    <MapContainer
      center={[49.0, 31.0]}
      zoom={6}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <MarkersLayer
        users={users}
        filter={filter}
      />
    </MapContainer>
  );
};

export default UserMap;
