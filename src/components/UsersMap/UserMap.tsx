import { MapContainer, TileLayer, useMap } from "react-leaflet";
import type { User } from "../../types/User";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet.markercluster";
import { useEffect, useRef } from "react";

import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [0, -41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface UserMapProps {
  users: User[];
  filter: string;
}

function MarkerClusterLayer({ users, filter }: UserMapProps) {
  const map = useMap();
  const clusterGroupRef = useRef<L.MarkerClusterGroup | null>(null);

  useEffect(() => {
    if (clusterGroupRef.current) {
      map.removeLayer(clusterGroupRef.current);
      clusterGroupRef.current = null;
    }

    const filteredUsers = users.filter((user) => {
      if (!filter) return true;
      return user.interests.some((interest) =>
        interest.toLowerCase().includes(filter.toLowerCase())
      );
    });

    const markerClusterGroup = L.markerClusterGroup({
      chunkedLoading: true,
      maxClusterRadius: 80,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
    });

    filteredUsers.forEach((user) => {
      const marker = L.marker([user.lat, user.lon], {
        icon: DefaultIcon,
      });

      marker.bindPopup(`
        <div style="min-width: 200px;">
          <strong>${user.name}</strong><br/>
          <em>${user.interests.join(", ")}</em>
        </div>
      `);

      markerClusterGroup.addLayer(marker);
    });

    map.addLayer(markerClusterGroup);
    clusterGroupRef.current = markerClusterGroup;

    return () => {
      if (clusterGroupRef.current) {
        map.removeLayer(clusterGroupRef.current);
        clusterGroupRef.current = null;
      }
    };
  }, [map, users, filter]);

  return null;
}

const UserMap = ({ users, filter }: UserMapProps) => {
  return (
    <MapContainer
      center={[49.0, 31.0]}
      zoom={6}
      style={{ height: "100vh", width: "100%" }}
      scrollWheelZoom={true}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <MarkerClusterLayer
        users={users}
        filter={filter}
      />
    </MapContainer>
  );
};

export default UserMap;
