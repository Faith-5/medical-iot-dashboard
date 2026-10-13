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
  FaCheckCircle,
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

  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  // Status evaluators
  const getHeartRateStatus = (bpm) => {
    if (!bpm) return { label: "Awaiting", color: "text-slate-500 bg-slate-100 border-slate-200" };
    const num = Number(bpm);
    if (num < 60) return { label: "Low", color: "text-amber-700 bg-amber-50 border-amber-200" };
    if (num > 100) return { label: "High", color: "text-rose-700 bg-rose-50 border-rose-200" };
    return { label: "Normal", color: "text-emerald-700 bg-emerald-50 border-emerald-200" };
  };

  const getTempStatus = (temp) => {
    if (!temp) return { label: "Awaiting", color: "text-slate-500 bg-slate-100 border-slate-200" };
    const num = Number(temp);
    if (num < 36.0) return { label: "Low", color: "text-sky-700 bg-sky-50 border-sky-200" };
    if (num > 37.8) return { label: "Fever", color: "text-rose-700 bg-rose-50 border-rose-200" };
    return { label: "Normal", color: "text-emerald-700 bg-emerald-50 border-emerald-200" };
  };

  const heartStatus = getHeartRateStatus(data?.heartbeat);
  const tempStatus = getTempStatus(data?.temperature);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-sky-50/40 to-slate-100 text-slate-800 p-4 sm:p-6 lg:p-8 font-sans">
      
      {/* HEADER / NAVIGATION BAR */}
      <header className="flex flex-col lg:flex-row justify-between items-center bg-white/95 border border-sky-100 backdrop-blur-md px-5 py-3.5 rounded-2xl shadow-sm shadow-sky-100/50 mb-5 gap-4">
        
        {/* Brand & System Title */}
        <div className="flex items-center gap-3.5 w-full lg:w-auto justify-between lg:justify-start">
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="MediPulse Care"
              className="w-10 h-10 rounded-xl object-cover border border-sky-200 shadow-sm"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-slate-900 flex items-center gap-1.5">
                  MediPulse <span className="text-sky-600">Care</span>
                </h1>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  LIVE
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Patient: <span className="font-semibold text-slate-700">Evelyn Reed</span> • ICU Bay 04
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation & Badges */}
        <div className="flex flex-wrap items-center justify-between lg:justify-end gap-3 w-full lg:w-auto">
          {/* Navigation Tabs */}
          <nav className="flex bg-sky-50/80 p-1 rounded-xl border border-sky-100 text-xs font-semibold">
            <button
              onClick={() => setActiveTab("home")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                activeTab === "home"
                  ? "bg-sky-600 text-white shadow-sm shadow-sky-600/25"
                  : "text-slate-600 hover:text-sky-700 hover:bg-white/80"
              }`}
            >
              <FaThLarge className="text-xs" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setActiveTab("charts")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                activeTab === "charts"
                  ? "bg-sky-600 text-white shadow-sm shadow-sky-600/25"
                  : "text-slate-600 hover:text-sky-700 hover:bg-white/80"
              }`}
            >
              <FaChartLine className="text-xs" />
              <span>Trends</span>
            </button>

            <button
              onClick={() => setActiveTab("location")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                activeTab === "location"
                  ? "bg-sky-600 text-white shadow-sm shadow-sky-600/25"
                  : "text-slate-600 hover:text-sky-700 hover:bg-white/80"
              }`}
            >
              <FaMapMarkerAlt className="text-xs" />
              <span>Location</span>
            </button>
          </nav>

          {/* Clinician Badges */}
          <div className="hidden sm:flex items-center gap-2 text-xs">
            <div className="flex items-center gap-1.5 bg-sky-50/90 border border-sky-200/80 px-2.5 py-1.5 rounded-xl text-sky-900 font-medium">
              <FaProcedures className="text-sky-600" />
              <span>Tag: <strong className="font-mono text-sky-800">{user}</strong></span>
            </div>
            <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-2.5 py-1.5 rounded-xl text-slate-700 font-medium shadow-2xs">
              <FaUserNurse className="text-sky-600" />
              <span>Dr. M. Vance</span>
            </div>
          </div>
        </div>

      </header>

      {/* QUICK STATUS BAR */}
      <div className="flex items-center justify-between bg-white/80 border border-sky-100 rounded-xl px-4 py-2 mb-5 text-xs text-slate-500 shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
          <span className="font-medium text-slate-700">Continuous Telemetry Active</span>
        </div>
        <div className="text-slate-500 font-mono text-[11px]">
          Last Sync: <span className="text-sky-700 font-semibold">{currentTime}</span>
        </div>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === "home" && (
        <div className="space-y-5">
          {/* 6 Vital Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            
            {/* 1. Heart Rate */}
            <div className="bg-white border border-sky-100 hover:border-sky-300 rounded-2xl p-5 shadow-xs hover:shadow-md transition">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500">
                    <FaHeartbeat className="text-lg animate-heart-pulse" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Heart Rate</h3>
                  </div>
                </div>
                <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${heartStatus.color}`}>
                  {heartStatus.label}
                </span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-extrabold text-slate-900 tracking-tight font-mono">
                  {data?.heartbeat ?? "—"}
                </span>
                <span className="text-xs font-semibold text-rose-500">bpm</span>
              </div>
              <div className="mt-3 pt-2.5 border-t border-slate-100 flex justify-between text-[11px] text-slate-400">
                <span>Normal Range</span>
                <span className="text-slate-600 font-medium">60 – 100 bpm</span>
              </div>
            </div>

            {/* 2. Blood Volume Pulse */}
            <div className="bg-white border border-sky-100 hover:border-sky-300 rounded-2xl p-5 shadow-xs hover:shadow-md transition">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600">
                    <FaTint className="text-lg" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Blood Pulse</h3>
                  </div>
                </div>
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full border text-sky-700 bg-sky-50 border-sky-200">
                  Perfusion
                </span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-extrabold text-slate-900 tracking-tight font-mono">
                  {data?.bloodVolumePulse ?? "—"}
                </span>
                <span className="text-xs font-semibold text-sky-600">%</span>
              </div>
              <div className="mt-3 pt-2.5 border-t border-slate-100 flex justify-between text-[11px] text-slate-400">
                <span>Signal Strength</span>
                <span className="text-sky-700 font-medium">Optimal</span>
              </div>
            </div>

            {/* 3. Body Temperature */}
            <div className="bg-white border border-sky-100 hover:border-sky-300 rounded-2xl p-5 shadow-xs hover:shadow-md transition">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600">
                    <FaThermometerHalf className="text-lg" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Body Temp</h3>
                  </div>
                </div>
                <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${tempStatus.color}`}>
                  {tempStatus.label}
                </span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-extrabold text-slate-900 tracking-tight font-mono">
                  {data?.temperature ?? "—"}
                </span>
                <span className="text-xs font-semibold text-sky-600">°C</span>
              </div>
              <div className="mt-3 pt-2.5 border-t border-slate-100 flex justify-between text-[11px] text-slate-400">
                <span>Normal Range</span>
                <span className="text-slate-600 font-medium">36.5 – 37.5 °C</span>
              </div>
            </div>

            {/* 4. Patient Motion */}
            <div className="bg-white border border-sky-100 hover:border-sky-300 rounded-2xl p-5 shadow-xs hover:shadow-md transition">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                    <FaWalking className="text-lg" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Mobility</h3>
                  </div>
                </div>
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full border text-blue-700 bg-blue-50 border-blue-200">
                  Posture
                </span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-bold text-slate-900 tracking-tight">
                  {data?.motion ?? "Awaiting"}
                </span>
              </div>
              <div className="mt-3 pt-2.5 border-t border-slate-100 flex justify-between text-[11px] text-slate-400">
                <span>Fall Risk</span>
                <span className="text-emerald-600 font-semibold">Low</span>
              </div>
            </div>

            {/* 5. Voice Telemetry */}
            <div className="bg-white border border-sky-100 hover:border-sky-300 rounded-2xl p-5 shadow-xs hover:shadow-md transition">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center text-violet-600">
                    <FaMicrophone className="text-lg" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Voice State</h3>
                  </div>
                </div>
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full border text-violet-700 bg-violet-50 border-violet-200">
                  Acoustic
                </span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-bold text-slate-900 tracking-tight">
                  {data?.voice ?? "Awaiting"}
                </span>
              </div>
              <div className="mt-3 pt-2.5 border-t border-slate-100 flex justify-between text-[11px] text-slate-400">
                <span>Distress Level</span>
                <span className="text-emerald-600 font-medium">Calm</span>
              </div>
            </div>

            {/* 6. Geopositioning */}
            <div className="bg-white border border-sky-100 hover:border-sky-300 rounded-2xl p-5 shadow-xs hover:shadow-md transition">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
                    <FaMapMarkerAlt className="text-lg" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Location</h3>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab("location")}
                  className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full border text-amber-700 bg-amber-50 border-amber-200 hover:bg-amber-100 transition"
                >
                  Map →
                </button>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-bold text-slate-900 tracking-tight font-mono truncate">
                  {data?.gps ?? "Awaiting GPS"}
                </span>
              </div>
              <div className="mt-3 pt-2.5 border-t border-slate-100 flex justify-between text-[11px] text-slate-400">
                <span>Geofence</span>
                <span className="text-emerald-600 font-medium">Hospital Zone</span>
              </div>
            </div>

          </div>

          {/* Clean Quick Status Card */}
          <div className="bg-white border border-sky-100 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 text-lg shrink-0">
                <FaCheckCircle />
              </div>
              <p className="text-xs text-slate-600">
                All patient vitals are currently stable within baseline parameters.
              </p>
            </div>
            <button
              onClick={() => setActiveTab("charts")}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white transition shadow-sm shadow-sky-600/25 shrink-0"
            >
              View History Trends →
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: TRENDS (CHARTS) */}
      {activeTab === "charts" && (
        <div className="space-y-5">
          {/* Heart Rate Trends */}
          <div className="bg-white border border-sky-100 rounded-2xl p-5 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                <FaHeartbeat className="text-rose-500" />
                Heart Rate Trend (BPM)
              </h2>
              <span className="px-2.5 py-1 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 font-mono text-xs font-bold">
                {data?.heartbeat ?? "—"} bpm
              </span>
            </div>
            <div className="h-60 sm:h-72 w-full">
              <Line data={heartbeatData} options={heartbeatOptions} />
            </div>
          </div>

          {/* Blood Volume Pulse Trends */}
          <div className="bg-white border border-sky-100 rounded-2xl p-5 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                <FaTint className="text-sky-600" />
                Blood Volume Pulse Trend (%)
              </h2>
              <span className="px-2.5 py-1 rounded-lg bg-sky-50 border border-sky-200 text-sky-800 font-mono text-xs font-bold">
                {data?.bloodVolumePulse ?? "—"} %
              </span>
            </div>
            <div className="h-60 sm:h-72 w-full">
              <Line data={bloodPulseData} options={bloodPulseOptions} />
            </div>
          </div>

          {/* Body Temperature Trends */}
          <div className="bg-white border border-sky-100 rounded-2xl p-5 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                <FaThermometerHalf className="text-sky-600" />
                Core Body Temperature Trend (°C)
              </h2>
              <span className="px-2.5 py-1 rounded-lg bg-sky-50 border border-sky-200 text-sky-800 font-mono text-xs font-bold">
                {data?.temperature ?? "—"} °C
              </span>
            </div>
            <div className="h-60 sm:h-72 w-full">
              <Line data={tempData} options={tempOptions} />
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: LOCATION & GEOFENCE */}
      {activeTab === "location" && (
        <div className="bg-white border border-sky-100 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FaMapMarkerAlt className="text-sky-600" />
              Patient Geofence Tracker
            </h2>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Within Hospital Perimeter
            </span>
          </div>

          {/* Coordinate Summary Pills */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-sky-50/60 border border-sky-100 p-3 rounded-xl text-center">
              <p className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider">Latitude</p>
              <p className="text-sky-900 font-mono font-bold text-base mt-0.5">{lat || "Pending"}</p>
            </div>

            <div className="bg-sky-50/60 border border-sky-100 p-3 rounded-xl text-center">
              <p className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider">Longitude</p>
              <p className="text-sky-900 font-mono font-bold text-base mt-0.5">{lng || "Pending"}</p>
            </div>

            <div className="bg-sky-50/60 border border-sky-100 p-3 rounded-xl text-center">
              <p className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider">Location</p>
              <p className="text-slate-700 text-xs font-medium mt-1 truncate" title={place}>
                {place || "Fetching location..."}
              </p>
            </div>
          </div>

          {/* OpenStreetMap Container */}
          <div className="w-full h-80 sm:h-96 rounded-xl overflow-hidden border border-sky-150 shadow-inner">
            <MapContainer
              center={[lat || 9.0765, lng || 7.3986]}
              zoom={14}
              style={{ height: "100%", width: "100%" }}
              key={`${lat}-${lng}`}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              />
              <Marker position={[lat || 9.0765, lng || 7.3986]}>
                <Popup>
                  <div className="text-slate-900 text-xs">
                    <strong>Patient: Evelyn Reed</strong><br />
                    Tag: {user}<br />
                    {place}
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
