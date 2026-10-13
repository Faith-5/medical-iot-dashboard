import { useState } from "react";
import { FaUserMd, FaHeartbeat, FaShieldAlt, FaKey, FaLaptopMedical } from "react-icons/fa";
import bgImage from "./static/medical_bg.jpg";
import logo from "./static/medical_logo.jpg";

function LoginPage({ onLogin }) {
  const [id, setId] = useState("");
  const [error, setError] = useState("");

  const allowedIds = ["00:11:22"];

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedId = id.trim();

    if (!trimmedId) {
      setError("Please input the assigned Patient Biosensor or Clinician ID.");
      return;
    }

    if (!allowedIds.includes(trimmedId)) {
      setError("Unrecognized Biosensor ID. Please verify active clinic authorization.");
      return;
    }

    setError("");
    onLogin(trimmedId);
  };

  const handleQuickDemo = () => {
    setId("00:11:22");
    setError("");
  };

  return (
    <div
      className="relative flex items-center justify-center min-h-screen bg-slate-950 bg-cover bg-center overflow-hidden px-4"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* High-tech clinical ambient vignette and blur overlay */}
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-[6px] bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-900/60"></div>

      {/* Radial soft cyan glow behind card */}
      <div className="absolute w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Main Authentication Card */}
      <div className="relative z-10 w-full max-w-md bg-slate-900/75 border border-cyan-500/30 backdrop-blur-xl rounded-3xl p-8 sm:p-9 shadow-2xl shadow-cyan-950/40">
        
        {/* Top Clinical Header */}
        <div className="flex flex-col items-center mb-7 text-center">
          <div className="relative mb-3">
            <img
              src={logo}
              alt="MediPulse Clinical Systems"
              className="w-20 h-20 rounded-2xl object-cover border border-cyan-400/40 shadow-lg shadow-cyan-500/20"
            />
            <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-cyan-500 border-2 border-slate-900"></span>
            </span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <FaLaptopMedical className="text-cyan-400" />
            <span>Clinical IoT Telemetry Portal</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            MediPulse <span className="text-cyan-400">Care</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xs">
            Physician Gateway for Continuous Real-Time Biosensor Monitoring
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <FaKey className="text-cyan-400" />
                Biosensor / Device Tag ID
              </label>
              <button
                type="button"
                onClick={handleQuickDemo}
                className="text-[11px] text-cyan-400 hover:text-cyan-300 underline font-medium transition"
              >
                Auto-fill (00:11:22)
              </button>
            </div>

            <div className="relative">
              <input
                type="text"
                placeholder="e.g. 00:11:22"
                value={id}
                onChange={(e) => {
                  setId(e.target.value);
                  if (error) setError("");
                }}
                className="w-full px-4 py-3.5 rounded-xl bg-slate-950/70 border border-slate-700/80 text-white placeholder-slate-500 font-mono text-sm focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition"
              />
            </div>

            {error && (
              <div className="mt-2.5 p-2.5 rounded-lg bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                <FaHeartbeat className="shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 active:scale-[0.99] shadow-lg shadow-cyan-600/25 transition duration-200 flex items-center justify-center gap-2"
          >
            <FaUserMd className="text-base" />
            <span>Connect to Patient Stream</span>
          </button>
        </form>

        {/* Security & Regulatory footer */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <FaShieldAlt className="text-cyan-400" />
            <span>HIPAA Compliant Encrypted Stream</span>
          </div>
          <span className="text-slate-500 font-mono">v2.4 ICU-Core</span>
        </div>

      </div>
    </div>
  );
}

export default LoginPage;
