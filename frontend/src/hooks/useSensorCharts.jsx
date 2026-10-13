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
        borderColor: "#10b981",
        backgroundColor: "rgba(16, 185, 129, 0.15)",
        fill: true,
        tension: 0.35,
        borderWidth: 2.5,
        pointRadius: 4,
        pointBackgroundColor: "#10b981",
      },
    ],
  });

  const [heartbeatData, setHeartbeatData] = useState({
    labels: [],
    datasets: [
      {
        label: "Cardiac Pulse (bpm)",
        data: [],
        borderColor: "#f43f5e",
        backgroundColor: "rgba(244, 63, 94, 0.15)",
        fill: true,
        tension: 0.35,
        borderWidth: 2.5,
        pointRadius: 4,
        pointBackgroundColor: "#f43f5e",
      },
    ],
  });

  const [bloodPulseData, setBloodPulseData] = useState({
    labels: [],
    datasets: [
      {
        label: "Blood Volume Pulse / BVP (%)",
        data: [],
        borderColor: "#06b6d4",
        backgroundColor: "rgba(6, 182, 212, 0.15)",
        fill: true,
        tension: 0.35,
        borderWidth: 2.5,
        pointRadius: 4,
        pointBackgroundColor: "#06b6d4",
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
        color: "rgba(51, 65, 85, 0.3)",
      },
      ticks: {
        color: "#94a3b8",
        font: { size: 11, family: "JetBrains Mono" },
      },
    },
    y: {
      grid: {
        color: "rgba(51, 65, 85, 0.3)",
      },
      ticks: {
        color: "#94a3b8",
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
        labels: { color: "#e2e8f0", font: { weight: "600", family: "Plus Jakarta Sans" } },
      },
    },
    scales: {
      ...commonScales,
      y: {
        ...commonScales.y,
        title: { display: true, text: "Temperature (°C)", color: "#10b981", font: { weight: "bold" } },
      },
      x: {
        ...commonScales.x,
        title: { display: true, text: "Timestamp", color: "#64748b" },
      },
    },
  }), []);

  const heartbeatOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    plugins: {
      legend: {
        labels: { color: "#e2e8f0", font: { weight: "600", family: "Plus Jakarta Sans" } },
      },
    },
    scales: {
      ...commonScales,
      y: {
        ...commonScales.y,
        title: { display: true, text: "Heart Rate (BPM)", color: "#f43f5e", font: { weight: "bold" } },
      },
      x: {
        ...commonScales.x,
        title: { display: true, text: "Timestamp", color: "#64748b" },
      },
    },
  }), []);

  const bloodPulseOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    plugins: {
      legend: {
        labels: { color: "#e2e8f0", font: { weight: "600", family: "Plus Jakarta Sans" } },
      },
    },
    scales: {
      ...commonScales,
      y: {
        ...commonScales.y,
        title: { display: true, text: "Blood Volume Pulse (%)", color: "#06b6d4", font: { weight: "bold" } },
      },
      x: {
        ...commonScales.x,
        title: { display: true, text: "Timestamp", color: "#64748b" },
      },
    },
  }), []);

  return { tempData, heartbeatData, bloodPulseData, tempOptions, heartbeatOptions, bloodPulseOptions };
}
