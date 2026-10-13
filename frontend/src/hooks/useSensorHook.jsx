import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_API_URL);

export default function useSensorData() {
  const [data, setData] = useState(null);

  useEffect(() => {
    socket.on("sensorUpdate", (newData) => {
      setData(newData);
    });

    return () => {
      socket.off("sensorUpdate");
    };
  }, []);

  return data;
}
