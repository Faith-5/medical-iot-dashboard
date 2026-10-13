import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_API_URL);

export function useLiveLocation() {
  const [location, setLocation] = useState({
    lat: 0,
    lng: 0,
    place: "Detecting patient telemetry beacon...",
  });

  useEffect(() => {
    const handleUpdate = async (data) => {
      if (!data?.gps) return;

      const [latStr, lngStr] = data.gps.split(",").map((val) => val.trim());
      const lat = parseFloat(latStr);
      const lng = parseFloat(lngStr);

      if (isNaN(lat) || isNaN(lng)) return;

      let placeName = "Ward / Clinic Coordinate";
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
        );
        const result = await response.json();
        placeName = result.display_name || "Ward / Clinical Area";
      } catch (err) {
        console.error("Geocoding clinical location error:", err);
      }

      setLocation({ lat, lng, place: placeName });
    };

    socket.on("sensorUpdate", handleUpdate);

    return () => {
      socket.off("sensorUpdate", handleUpdate);
    };
  }, []);

  return location;
}
