import { useState, useEffect, useMemo } from "react";
import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_API_URL);

export default function useSensorCharts() {
  const [tempData, setTempData] = useState({
    labels: [],
    datasets: [
      {
        label: "Core Body Temp (°C)",
        data: [],
        borderColor: "#0284c7",
        backgroundColor: "rgba(2, 132, 199, 0.12)",
        fill: true,
        tension: 0.35,
        borderWidth: 2.5,
        pointRadius: 4,
        pointBackgroundColor: "#0284c7",
      },
    ],
  });

  const [heartbeatData, setHeartbeatData] = useState({
    labels: [],
    datasets: [
      {
        label: "Heart Rate (BPM)",
        data: [],
        borderColor: "#e11d48",
        backgroundColor: "rgba(225, 29, 72, 0.12)",
        fill: true,
        tension: 0.35,
        borderWidth: 2.5,
        pointRadius: 4,
        pointBackgroundColor: "#e11d48",
      },
    ],
  });

  const [bloodPulseData, setBloodPulseData] = useState({
    labels: [],
    datasets: [
      {
        label: "Blood Volume Pulse (%)",
        data: [],
        borderColor: "#0ea5e9",
        backgroundColor: "rgba(14, 165, 233, 0.12)",
        fill: true,
        tension: 0.35,
        borderWidth: 2.5,
        pointRadius: 4,
        pointBackgroundColor: "#0ea5e9",
      },
    ],
  });

  useEffect(() => {
    const handleSensorUpdate = (packet) => {
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

      setTempData((prev) => ({
        ...prev,
        labels: [...prev.labels, time].slice(-10),
        datasets: [
          {
            ...prev.datasets[0],
            data: [
              ...prev.datasets[0].data,
              Number(packet.temperature) || 0,
            ].slice(-10),
          },
        ],
      }));

      setHeartbeatData((prev) => ({
        ...prev,
        labels: [...prev.labels, time].slice(-10),
        datasets: [
          {
            ...prev.datasets[0],
            data: [
              ...prev.datasets[0].data,
              Number(packet.heartbeat) || 0,
            ].slice(-10),
          },
        ],
      }));

      setBloodPulseData((prev) => ({
        ...prev,
        labels: [...prev.labels, time].slice(-10),
        datasets: [
          {
            ...prev.datasets[0],
            data: [
              ...prev.datasets[0].data,
              Number(packet.bloodVolumePulse) || 0,
            ].slice(-10),
          },
        ],
      }));
    };

    socket.on("sensorUpdate", handleSensorUpdate);

    return () => {
      socket.off("sensorUpdate", handleSensorUpdate);
    };
  }, []);

  // Common chart styling for hospital monitors
  const commonScales = {
    x: {
      grid: {
        color: "rgba(224, 242, 254, 0.8)",
      },
      ticks: {
        color: "#64748b",
        font: { size: 11, family: "JetBrains Mono" },
      },
    },
    y: {
      grid: {
        color: "rgba(224, 242, 254, 0.8)",
      },
      ticks: {
        color: "#64748b",
        font: { size: 11, family: "JetBrains Mono" },
      },
    },
  };

  const tempOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    plugins: {
      legend: {
        labels: { color: "#0f172a", font: { weight: "600", family: "Plus Jakarta Sans" } },
      },
    },
    scales: {
      ...commonScales,
      y: {
        ...commonScales.y,
        title: { display: true, text: "Temperature (°C)", color: "#0284c7", font: { weight: "bold" } },
      },
      x: {
        ...commonScales.x,
        title: { display: true, text: "Time", color: "#64748b" },
      },
    },
  }), []);

  const heartbeatOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    plugins: {
      legend: {
        labels: { color: "#0f172a", font: { weight: "600", family: "Plus Jakarta Sans" } },
      },
    },
    scales: {
      ...commonScales,
      y: {
        ...commonScales.y,
        title: { display: true, text: "Heart Rate (BPM)", color: "#e11d48", font: { weight: "bold" } },
      },
      x: {
        ...commonScales.x,
        title: { display: true, text: "Time", color: "#64748b" },
      },
    },
  }), []);

  const bloodPulseOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    plugins: {
      legend: {
        labels: { color: "#0f172a", font: { weight: "600", family: "Plus Jakarta Sans" } },
      },
    },
    scales: {
      ...commonScales,
      y: {
        ...commonScales.y,
        title: { display: true, text: "Blood Volume Pulse (%)", color: "#0284c7", font: { weight: "bold" } },
      },
      x: {
        ...commonScales.x,
        title: { display: true, text: "Time", color: "#64748b" },
      },
    },
  }), []);

  return { tempData, heartbeatData, bloodPulseData, tempOptions, heartbeatOptions, bloodPulseOptions };
}
