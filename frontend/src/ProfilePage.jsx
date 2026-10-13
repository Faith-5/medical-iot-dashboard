import { FaUserCircle, FaHospital, FaHeartbeat, FaIdBadge, FaStethoscope, FaArrowRight, FaProcedures } from "react-icons/fa";
import bgImage from "./static/medical_bg.jpg";
import logo from "./static/medical_logo.jpg";

function ProfilePage({ user, onContinue }) {
  return (
    <div
      className="relative flex items-center justify-center min-h-screen bg-slate-950 bg-cover bg-center overflow-hidden px-4 py-8"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* High-tech clinical overlay */}
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-[6px] bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-900/60"></div>

      {/* Radial soft cyan glow behind card */}
      <div className="absolute w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Patient Dossier Card */}
      <div className="relative z-10 w-full max-w-lg bg-slate-900/75 border border-cyan-500/30 backdrop-blur-xl rounded-3xl p-7 sm:p-9 shadow-2xl shadow-cyan-950/40 text-slate-100 flex flex-col items-center">
        
        {/* Hospital Brand Badge */}
        <div className="flex items-center gap-3 mb-5">
          <img
            src={logo}
            alt="MediPulse Logo"
            className="w-12 h-12 rounded-xl object-cover border border-cyan-400/40 shadow-md shadow-cyan-500/20"
          />
          <div>
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              MediPulse Clinical Network
              <span className="text-[10px] font-semibold bg-cyan-950 text-cyan-300 border border-cyan-600/40 px-2 py-0.5 rounded-full">ICU</span>
            </h2>
            <p className="text-xs text-slate-400">Electronic Health Record & Biosensor Link</p>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-extrabold text-white text-center">
          Patient Telemetry Dossier
        </h1>
        <p className="text-slate-400 text-xs text-center mt-0.5 mb-6">
          Synchronized wireless patient biosensor stream verification
        </p>

        {/* Patient Avatar & Clinical Status Pill */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-slate-800/80 border-2 border-cyan-400/50 flex items-center justify-center shadow-lg shadow-cyan-900/30 text-cyan-300">
              <FaProcedures className="text-3xl" />
            </div>
            <span className="absolute bottom-0 right-0 p-1.5 bg-emerald-500 rounded-full border-2 border-slate-900" title="Telemetry Active"></span>
          </div>
          <h3 className="mt-2 text-lg font-bold text-white">Evelyn Reed</h3>
          <p className="text-xs text-slate-400">46 Yrs • Female • Blood Group O+</p>
        </div>

        {/* Information Table Section */}
        <div className="w-full bg-slate-950/60 rounded-2xl p-5 space-y-3.5 border border-slate-800">
          
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
            <div className="flex items-center gap-2.5 text-slate-400 text-xs">
              <FaIdBadge className="text-cyan-400 text-sm" />
              <span>Assigned Device Tag</span>
            </div>
            <span className="font-mono text-cyan-300 font-bold text-sm bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
              {user}
            </span>
          </div>

          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
            <div className="flex items-center gap-2.5 text-slate-400 text-xs">
              <FaHospital className="text-cyan-400 text-sm" />
              <span>Clinical Ward / Room</span>
            </div>
            <span className="font-medium text-slate-200 text-sm">
              ICU Bay 04 (Cardiology Wing)
            </span>
          </div>

          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
            <div className="flex items-center gap-2.5 text-slate-400 text-xs">
              <FaHeartbeat className="text-rose-400 text-sm" />
              <span>Acuity Monitoring State</span>
            </div>
            <span className="font-semibold text-emerald-400 text-xs flex items-center gap-1.5 bg-emerald-950/50 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Continuous Observation
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-slate-400 text-xs">
              <FaStethoscope className="text-cyan-400 text-sm" />
              <span>Attending Physician</span>
            </div>
            <span className="font-medium text-slate-200 text-sm">
              Dr. Marcus Vance, MD
            </span>
          </div>

        </div>

        {/* Diagnosis Note */}
        <div className="mt-4 w-full p-3 rounded-xl bg-blue-950/40 border border-blue-500/20 text-xs text-blue-200/90 leading-relaxed">
          <span className="font-bold text-cyan-400">Clinical Protocol: </span>
          Real-time telemetry configured for cardiac rhythm, photoplethysmogram (BVP), core thermoregulation, and patient mobility tracking.
        </div>

        {/* Action Button */}
        <button
          onClick={onContinue}
          className="mt-6 w-full py-3.5 px-4 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 active:scale-[0.99] shadow-lg shadow-cyan-600/30 transition duration-200 flex items-center justify-center gap-2"
        >
          <span>Launch Telemetry Command Center</span>
          <FaArrowRight className="text-xs" />
        </button>

      </div>
    </div>
  );
}

export default ProfilePage;
