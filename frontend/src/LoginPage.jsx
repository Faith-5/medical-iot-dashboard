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
      setError("Please enter the Patient Biosensor ID.");
      return;
    }

    if (!allowedIds.includes(trimmedId)) {
      setError("Unrecognized ID. Try demo ID: 00:11:22");
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
      className="relative flex items-center justify-center min-h-screen bg-sky-50 bg-cover bg-center overflow-hidden px-4 font-sans"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Light serene sky-blue clinical overlay */}
      <div className="absolute inset-0 bg-sky-950/40 backdrop-blur-[5px] bg-gradient-to-t from-sky-950/70 via-sky-900/40 to-slate-900/40"></div>

      {/* Main Authentication Card */}
      <div className="relative z-10 w-full max-w-md bg-white/95 border border-sky-150 backdrop-blur-xl rounded-3xl p-7 sm:p-8 shadow-xl shadow-sky-950/20 text-slate-800">
        
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-6 text-center">
          <div className="relative mb-3">
            <img
              src={logo}
              alt="MediPulse Care"
              className="w-16 h-16 rounded-2xl object-cover border border-sky-200 shadow-sm"
            />
            <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-sky-500 border-2 border-white"></span>
            </span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-800 text-[11px] font-semibold uppercase tracking-wider mb-2">
            <FaLaptopMedical className="text-sky-600" />
            <span>Clinical Telemetry Portal</span>
          </div>

          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            MediPulse <span className="text-sky-600">Care</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time wireless biosensor monitoring
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <FaKey className="text-sky-600" />
                Device Tag ID
              </label>
              <button
                type="button"
                onClick={handleQuickDemo}
                className="text-[11px] text-sky-600 hover:text-sky-800 underline font-medium transition"
              >
                Auto-fill (00:11:22)
              </button>
            </div>

            <input
              type="text"
              placeholder="e.g. 00:11:22"
              value={id}
              onChange={(e) => {
                setId(e.target.value);
                if (error) setError("");
              }}
              className="w-full px-4 py-3 rounded-xl bg-sky-50/50 border border-sky-200 text-slate-900 placeholder-slate-400 font-mono text-sm focus:outline-none focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-400/20 transition"
            />

            {error && (
              <div className="mt-2 p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <FaHeartbeat className="shrink-0 text-rose-500" />
                <span>{error}</span>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl font-semibold text-sm text-white bg-sky-600 hover:bg-sky-500 active:scale-[0.99] shadow-md shadow-sky-600/25 transition duration-200 flex items-center justify-center gap-2"
          >
            <FaUserMd className="text-base" />
            <span>Connect to Patient Stream</span>
          </button>
        </form>

        {/* Footer */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5 text-slate-500">
            <FaShieldAlt className="text-sky-600" />
            <span>Encrypted Hospital Stream</span>
          </div>
          <span className="text-slate-400 font-mono">v2.4</span>
        </div>

      </div>
    </div>
  );
}

export default LoginPage;
