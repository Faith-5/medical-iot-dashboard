import { FaHospital, FaHeartbeat, FaIdBadge, FaStethoscope, FaArrowRight, FaProcedures } from "react-icons/fa";
import bgImage from "./static/medical_bg.jpg";
import logo from "./static/medical_logo.jpg";

function ProfilePage({ user, onContinue }) {
  return (
    <div
      className="relative flex items-center justify-center min-h-screen bg-sky-50 bg-cover bg-center overflow-hidden px-4 py-8 font-sans"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Light sky-blue clinical overlay */}
      <div className="absolute inset-0 bg-sky-950/40 backdrop-blur-[5px] bg-gradient-to-t from-sky-950/70 via-sky-900/40 to-slate-900/40"></div>

      {/* Patient Card */}
      <div className="relative z-10 w-full max-w-md bg-white/95 border border-sky-150 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-xl shadow-sky-950/20 text-slate-800 flex flex-col items-center">
        
        {/* Brand */}
        <div className="flex items-center gap-3 mb-4">
          <img
            src={logo}
            alt="MediPulse Care"
            className="w-11 h-11 rounded-xl object-cover border border-sky-200 shadow-sm"
          />
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              MediPulse Care
              <span className="text-[10px] font-semibold bg-sky-100 text-sky-800 border border-sky-200 px-2 py-0.5 rounded-full">ICU</span>
            </h2>
            <p className="text-xs text-slate-500">Patient Telemetry Record</p>
          </div>
        </div>

        {/* Patient Avatar & Status */}
        <div className="flex flex-col items-center mb-5">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-sky-50 border-2 border-sky-300 flex items-center justify-center text-sky-600 shadow-sm">
              <FaProcedures className="text-2xl" />
            </div>
            <span className="absolute bottom-0 right-0 p-1.5 bg-emerald-500 rounded-full border-2 border-white" title="Active"></span>
          </div>
          <h3 className="mt-2.5 text-lg font-bold text-slate-900">Evelyn Reed</h3>
          <p className="text-xs text-slate-500">46 Yrs • Female • O+</p>
        </div>

        {/* Information Table Section */}
        <div className="w-full bg-sky-50/50 rounded-2xl p-4 space-y-3 border border-sky-100">
          
          <div className="flex items-center justify-between border-b border-sky-100/80 pb-2">
            <div className="flex items-center gap-2 text-slate-500 text-xs">
              <FaIdBadge className="text-sky-600 text-sm" />
              <span>Device Tag</span>
            </div>
            <span className="font-mono text-sky-900 font-bold text-xs bg-white px-2 py-0.5 rounded border border-sky-200">
              {user}
            </span>
          </div>

          <div className="flex items-center justify-between border-b border-sky-100/80 pb-2">
            <div className="flex items-center gap-2 text-slate-500 text-xs">
              <FaHospital className="text-sky-600 text-sm" />
              <span>Ward / Room</span>
            </div>
            <span className="font-medium text-slate-800 text-xs">
              ICU Bay 04 (Cardiology)
            </span>
          </div>

          <div className="flex items-center justify-between border-b border-sky-100/80 pb-2">
            <div className="flex items-center gap-2 text-slate-500 text-xs">
              <FaHeartbeat className="text-rose-500 text-sm" />
              <span>Status</span>
            </div>
            <span className="font-semibold text-emerald-700 text-xs flex items-center gap-1.5 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Telemetry Active
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-500 text-xs">
              <FaStethoscope className="text-sky-600 text-sm" />
              <span>Physician</span>
            </div>
            <span className="font-medium text-slate-800 text-xs">
              Dr. Marcus Vance, MD
            </span>
          </div>

        </div>

        {/* Action Button */}
        <button
          onClick={onContinue}
          className="mt-5 w-full py-3 px-4 rounded-xl font-semibold text-sm text-white bg-sky-600 hover:bg-sky-500 active:scale-[0.99] shadow-md shadow-sky-600/25 transition duration-200 flex items-center justify-center gap-2"
        >
          <span>Open Live Dashboard</span>
          <FaArrowRight className="text-xs" />
        </button>

      </div>
    </div>
  );
}

export default ProfilePage;
