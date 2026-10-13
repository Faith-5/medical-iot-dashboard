import L from "leaflet";
import "leaflet/dist/leaflet.css";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useLiveLocation } from "./hooks/useLiveLocation";
import useSensorData from "./hooks/useSensorHook";
import useSensorCharts from "./hooks/useSensorCharts";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import {
  FaHeartbeat,
  FaThermometerHalf,
  FaTint,
  FaWalking,
  FaMicrophone,
  FaMapMarkerAlt,
  FaChartLine,
  FaThLarge,
  FaUserNurse,
  FaProcedures,
  FaSignal,
  FaShieldVirus,
} from "react-icons/fa";

import logo from "./static/medical_logo.jpg";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function Dashboard({ user }) {
  const data = useSensorData();
  const { lat, lng, place } = useLiveLocation();
  const { tempData, heartbeatData, bloodPulseData, tempOptions, heartbeatOptions, bloodPulseOptions } =
    useSensorCharts();

  const [activeTab, setActiveTab] = useState("home");

  const currentDate = new Date().toLocaleDateString(undefined, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const currentTime = new Date().toLocaleTimeString();

  // Clinical helper status evaluations
  const getHeartRateStatus = (bpm) => {
    if (!bpm) return { label: "Awaiting", color: "text-slate-400 bg-slate-800" };
    const num = Number(bpm);
    if (num < 60) return { label: "Bradycardia", color: "text-amber-400 bg-amber-950/60 border-amber-600/30" };
    if (num > 100) return { label: "Tachycardia", color: "text-rose-400 bg-rose-950/60 border-rose-600/30" };
    return { label: "Normal Sinus", color: "text-emerald-400 bg-emerald-950/60 border-emerald-600/30" };
  };

  const getTempStatus = (temp) => {
    if (!temp) return { label: "Awaiting", color: "text-slate-400 bg-slate-800" };
    const num = Number(temp);
    if (num < 36.0) return { label: "Hypothermia Risk", color: "text-cyan-400 bg-cyan-950/60 border-cyan-600/30" };
    if (num > 37.8) return { label: "Febrile State", color: "text-rose-400 bg-rose-950/60 border-rose-600/30" };
    return { label: "Normothermic", color: "text-emerald-400 bg-emerald-950/60 border-emerald-600/30" };
  };

  const heartStatus = getHeartRateStatus(data?.heartbeat);
  const tempStatus = getTempStatus(data?.temperature);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8">
      {/* HEADER / NAVIGATION BAR */}
      <header className="flex flex-col lg:flex-row justify-between items-center bg-slate-900/90 border border-slate-800 backdrop-blur-xl px-6 py-4 rounded-2xl shadow-xl shadow-cyan-950/20 mb-6 gap-4">
        
        {/* Brand & System Title */}
        <div className="flex items-center gap-3.5 w-full lg:w-auto justify-between lg:justify-start">
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="MediPulse Care"
              className="w-11 h-11 rounded-xl object-cover border border-cyan-500/40 shadow-md shadow-cyan-500/20"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                  MediPulse <span className="text-cyan-400">Clinical Command</span>
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  LIVE STREAM
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-2">
                <span>ICU Biosensor Monitor</span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-400">Bay 04 - Evelyn Reed</span>
              </p>
            </div>
          </div>

          <div className="lg:hidden flex items-center gap-1 text-emerald-400 text-xs">
            <FaSignal className="animate-pulse" />
          </div>
        </div>

        {/* Tab Controls & Clinician Badges */}
        <div className="flex flex-wrap items-center justify-between lg:justify-end gap-3 w-full lg:w-auto">
          {/* Navigation Tabs */}
          <nav className="flex bg-slate-950/70 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
            <button
              onClick={() => setActiveTab("home")}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition ${
                activeTab === "home"
                  ? "bg-cyan-600 text-white shadow-md shadow-cyan-600/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <FaThLarge className="text-xs" />
              <span>Vitals Overview</span>
            </button>

            <button
              onClick={() => setActiveTab("charts")}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition ${
                activeTab === "charts"
                  ? "bg-cyan-600 text-white shadow-md shadow-cyan-600/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <FaChartLine className="text-xs" />
              <span>Telemetry Trends</span>
            </button>

            <button
              onClick={() => setActiveTab("location")}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition ${
                activeTab === "location"
                  ? "bg-cyan-600 text-white shadow-md shadow-cyan-600/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <FaMapMarkerAlt className="text-xs" />
              <span>Patient Geofence</span>
            </button>
          </nav>

          {/* Clinician Badges */}
          <div className="hidden sm:flex items-center gap-2 text-xs">
            <div className="flex items-center gap-1.5 bg-slate-950/80 border border-slate-800 px-3 py-1.5 rounded-xl text-slate-300">
              <FaProcedures className="text-cyan-400" />
              <span>Device: <strong className="text-cyan-300 font-mono">{user}</strong></span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-950/80 border border-slate-800 px-3 py-1.5 rounded-xl text-slate-300">
              <FaUserNurse className="text-emerald-400" />
              <span>Dr. Marcus Vance, MD</span>
            </div>
          </div>
        </div>

      </header>

      {/* STATUS & TIMESTAMP BAR */}
      <div className="flex flex-col sm:flex-row items-center justify-between bg-slate-900/40 border border-slate-800/80 rounded-xl px-4 py-2.5 mb-6 text-xs text-slate-400 gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400"></span>
          <span>Continuous Biosensor Polling: Active</span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-300 font-medium">Protocol: Dual-Channel PPG & High-Precision Thermistor</span>
        </div>
        <div className="text-slate-400 font-mono text-[11px]">
          Last Telemetry Packet: <span className="text-cyan-300 font-semibold">{currentDate} {currentTime}</span>
        </div>
      </div>

      {/* TAB 1: VITALS OVERVIEW */}
      {activeTab === "home" && (
        <div className="space-y-6">
          {/* Main 6 Metric Tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            
            {/* Cardiac Pulse */}
            <div className="bg-slate-900/80 border border-slate-800 hover:border-rose-500/40 rounded-2xl p-5 shadow-lg shadow-black/40 relative overflow-hidden transition group">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-950/60 border border-rose-500/30 flex items-center justify-center text-rose-400">
                    <FaHeartbeat className="text-xl animate-heart-pulse" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Heart Rate</h3>
                    <p className="text-[11px] text-slate-500">ECG Biosensor Channel</p>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${heartStatus.color}`}>
                  {heartStatus.label}
                </span>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-white tracking-tight font-mono">
                  {data?.heartbeat ?? "—"}
                </span>
                <span className="text-sm font-semibold text-rose-400">bpm</span>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-800/80 flex justify-between text-[11px] text-slate-400">
                <span>Target Range: 60 - 100 bpm</span>
                <span className="text-emerald-400 font-medium">Continuous</span>
              </div>
            </div>

            {/* Blood Volume Pulse */}
            <div className="bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 rounded-2xl p-5 shadow-lg shadow-black/40 relative overflow-hidden transition group">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                    <FaTint className="text-xl" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Blood Volume Pulse</h3>
                    <p className="text-[11px] text-slate-500">Photoplethysmogram (BVP)</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border text-cyan-400 bg-cyan-950/60 border-cyan-500/30">
                  Perfusion Index
                </span>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-white tracking-tight font-mono">
                  {data?.bloodVolumePulse ?? "—"}
                </span>
                <span className="text-sm font-semibold text-cyan-400">%</span>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-800/80 flex justify-between text-[11px] text-slate-400">
                <span>Vascular Amplitude</span>
                <span className="text-cyan-300 font-medium">Optimal Waveform</span>
              </div>
            </div>

            {/* Body Temperature */}
            <div className="bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 rounded-2xl p-5 shadow-lg shadow-black/40 relative overflow-hidden transition group">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <FaThermometerHalf className="text-xl" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Core Body Temp</h3>
                    <p className="text-[11px] text-slate-500">Thermal Probe</p>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${tempStatus.color}`}>
                  {tempStatus.label}
                </span>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-white tracking-tight font-mono">
                  {data?.temperature ?? "—"}
                </span>
                <span className="text-sm font-semibold text-emerald-400">°C</span>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-800/80 flex justify-between text-[11px] text-slate-400">
                <span>Normal: 36.5 - 37.5 °C</span>
                <span className="text-emerald-400 font-medium">Regulated</span>
              </div>
            </div>

            {/* Motion / Mobility */}
            <div className="bg-slate-900/80 border border-slate-800 hover:border-blue-500/40 rounded-2xl p-5 shadow-lg shadow-black/40 relative overflow-hidden transition group">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-950/60 border border-blue-500/30 flex items-center justify-center text-blue-400">
                    <FaWalking className="text-xl" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Patient Mobility</h3>
                    <p className="text-[11px] text-slate-500">Inertial Sensor / IMU</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border text-blue-300 bg-blue-950/60 border-blue-500/30">
                  Bed / Posture
                </span>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-white tracking-tight">
                  {data?.motion ?? "Awaiting Data"}
                </span>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-800/80 flex justify-between text-[11px] text-slate-400">
                <span>Fall Risk: <strong className="text-emerald-400 font-semibold">Low</strong></span>
                <span className="text-slate-400">Tremor Free</span>
              </div>
            </div>

            {/* Voice / Acoustic Distress */}
            <div className="bg-slate-900/80 border border-slate-800 hover:border-purple-500/40 rounded-2xl p-5 shadow-lg shadow-black/40 relative overflow-hidden transition group">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-950/60 border border-purple-500/30 flex items-center justify-center text-purple-400">
                    <FaMicrophone className="text-xl" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Acoustic / Vocal</h3>
                    <p className="text-[11px] text-slate-500">Audio Telemetry Monitor</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border text-purple-300 bg-purple-950/60 border-purple-500/30">
                  Acoustic Guard
                </span>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-white tracking-tight">
                  {data?.voice ?? "Awaiting Data"}
                </span>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-800/80 flex justify-between text-[11px] text-slate-400">
                <span>Vocal Distress Detection</span>
                <span className="text-emerald-400 font-medium">Clear / Calm</span>
              </div>
            </div>

            {/* Live GPS Telemetry */}
            <div className="bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-5 shadow-lg shadow-black/40 relative overflow-hidden transition group">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-950/60 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <FaMapMarkerAlt className="text-xl" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Geopositioning</h3>
                    <p className="text-[11px] text-slate-500">Ambulatory Patient Tag</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab("location")}
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full border text-amber-300 bg-amber-950/60 border-amber-500/30 hover:bg-amber-900 transition"
                >
                  View Map →
                </button>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-lg sm:text-xl font-bold text-white tracking-tight font-mono truncate">
                  {data?.gps ?? "Awaiting GPS Fix"}
                </span>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-800/80 flex justify-between text-[11px] text-slate-400">
                <span>Geofence: <strong className="text-emerald-400 font-semibold">Safe Ward Zone</strong></span>
                <span className="text-slate-400 truncate max-w-[130px]">{place.split(",")[0]}</span>
              </div>
            </div>

          </div>

          {/* Quick Clinical Snapshot Card */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400 text-2xl shadow-lg shadow-cyan-950/50">
                <FaShieldVirus />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Physician Clinical Impression</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Vitals are tracking within anticipated surgical recovery parameters. No cardiac arrhythmia or critical threshold breaches observed.
                </p>
              </div>
            </div>
            <div className="flex gap-2.5">
              <button
                onClick={() => setActiveTab("charts")}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white transition shadow-md shadow-cyan-600/30"
              >
                Inspect Historical Graphs
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TELEMETRY TRENDS (CHARTS) */}
      {activeTab === "charts" && (
        <div className="space-y-6">
          {/* Heartbeat Trends */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 pb-3 border-b border-slate-800/80 gap-2">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <FaHeartbeat className="text-rose-400" />
                  Cardiac Pulse Rhythm & Waveform Trends
                </h2>
                <p className="text-xs text-slate-400">
                  Sliding window telemetry (BPM) sampled from continuous wireless biosensor
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="px-2.5 py-1 rounded-lg bg-rose-950/60 border border-rose-500/30 text-rose-300 font-mono font-bold">
                  Current: {data?.heartbeat ?? "—"} bpm
                </span>
              </div>
            </div>
            <div className="h-64 sm:h-72 md:h-80 w-full">
              <Line data={heartbeatData} options={heartbeatOptions} />
            </div>
          </div>

          {/* Blood Volume Pulse Trends */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 pb-3 border-b border-slate-800/80 gap-2">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <FaTint className="text-cyan-400" />
                  Blood Volume Pulse (BVP) & Perfusion Amplitude
                </h2>
                <p className="text-xs text-slate-400">
                  Optical photoplethysmogram tracking microvascular blood volume oscillations (%)
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="px-2.5 py-1 rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 font-mono font-bold">
                  Current: {data?.bloodVolumePulse ?? "—"} %
                </span>
              </div>
            </div>
            <div className="h-64 sm:h-72 md:h-80 w-full">
              <Line data={bloodPulseData} options={bloodPulseOptions} />
            </div>
          </div>

          {/* Body Temperature Trends */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 pb-3 border-b border-slate-800/80 gap-2">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <FaThermometerHalf className="text-emerald-400" />
                  Core Thermal Homeostasis Trends
                </h2>
                <p className="text-xs text-slate-400">
                  High-precision thermometric curve recorded in degrees Celsius (°C)
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 font-mono font-bold">
                  Current: {data?.temperature ?? "—"} °C
                </span>
              </div>
            </div>
            <div className="h-64 sm:h-72 md:h-80 w-full">
              <Line data={tempData} options={tempOptions} />
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: LOCATION & GEOFENCE */}
      {activeTab === "location" && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 pb-4 border-b border-slate-800/80 gap-2">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FaMapMarkerAlt className="text-cyan-400" />
                Patient Location & Facility Geofence Tracker
              </h2>
              <p className="text-xs text-slate-400">
                Live GPS positioning for ambulatory patient safety and telemetry range verification
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
              Within Hospital Boundary
            </span>
          </div>

          {/* Geolocation Coordinate Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl text-center">
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Latitude</p>
              <p className="text-cyan-300 font-mono font-bold text-lg mt-1">{lat || "Pending"}</p>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl text-center">
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Longitude</p>
              <p className="text-cyan-300 font-mono font-bold text-lg mt-1">{lng || "Pending"}</p>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl text-center">
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Identified Facility Area</p>
              <p className="text-slate-200 text-xs font-medium mt-1 truncate" title={place}>
                {place || "Fetching location..."}
              </p>
            </div>
          </div>

          {/* OpenStreetMap Container */}
          <div className="w-full h-80 sm:h-96 md:h-[450px] rounded-xl overflow-hidden border border-slate-800 shadow-inner">
            <MapContainer
              center={[lat || 9.0765, lng || 7.3986]}
              zoom={14}
              style={{ height: "100%", width: "100%" }}
              key={`${lat}-${lng}`}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={[lat || 9.0765, lng || 7.3986]}>
                <Popup>
                  <div className="text-slate-900 text-xs font-sans">
                    <strong>Patient: Evelyn Reed</strong><br />
                    Device Tag: {user}<br />
                    Location: {place}
                  </div>
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
