"use client";

export default function EarthGlobe() {
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none select-none">
      <div className="relative w-[500px] h-[500px] sm:w-[600px] sm:h-[600px] opacity-15">
        {/* Outer glow */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-b from-cyan-400/20 via-blue-500/10 to-transparent blur-3xl scale-110" />

        {/* Earth sphere */}
        <div
          className="absolute inset-0 rounded-full overflow-hidden"
          style={{
            background: `
              radial-gradient(circle at 35% 35%, rgba(56, 189, 248, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 65% 65%, rgba(6, 78, 59, 0.4) 0%, transparent 50%),
              radial-gradient(circle at 50% 50%, #0c1220 0%, #050810 100%)
            `,
            boxShadow: `
              inset -30px -30px 60px rgba(0,0,0,0.8),
              inset 20px 20px 40px rgba(56, 189, 248, 0.1),
              0 0 80px rgba(56, 189, 248, 0.08)
            `,
          }}
        >
          {/* Continent-like patterns that rotate */}
          <div
            className="absolute inset-0"
            style={{
              animation: "spin-slow 60s linear infinite",
            }}
          >
            {/* Land masses */}
            <div className="absolute top-[20%] left-[15%] w-[25%] h-[20%] rounded-[50%] bg-emerald-800/40 blur-sm" />
            <div className="absolute top-[15%] left-[45%] w-[15%] h-[25%] rounded-[40%] bg-emerald-700/30 blur-sm" />
            <div className="absolute top-[40%] left-[10%] w-[20%] h-[30%] rounded-[45%] bg-green-800/35 blur-sm" />
            <div className="absolute top-[35%] left-[55%] w-[22%] h-[18%] rounded-[50%] bg-emerald-800/30 blur-sm" />
            <div className="absolute top-[55%] left-[30%] w-[18%] h-[15%] rounded-[50%] bg-green-700/25 blur-sm" />
            <div className="absolute top-[25%] left-[75%] w-[15%] h-[20%] rounded-[40%] bg-emerald-700/25 blur-sm" />
            <div className="absolute top-[60%] left-[60%] w-[20%] h-[22%] rounded-[50%] bg-green-800/30 blur-sm" />
          </div>

          {/* Atmosphere overlay */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `
                radial-gradient(circle at 30% 30%, rgba(56, 189, 248, 0.15) 0%, transparent 60%),
                radial-gradient(circle at 70% 70%, rgba(0, 0, 0, 0.5) 0%, transparent 60%)
              `,
            }}
          />

          {/* Grid lines */}
          <div
            className="absolute inset-0 rounded-full opacity-[0.07]"
            style={{
              backgroundImage: `
                linear-gradient(0deg, transparent 49%, rgba(56, 189, 248, 0.5) 50%, transparent 51%),
                linear-gradient(90deg, transparent 49%, rgba(56, 189, 248, 0.5) 50%, transparent 51%)
              `,
              backgroundSize: "50px 50px",
              animation: "spin-slow 60s linear infinite",
            }}
          />

          {/* Light reflection */}
          <div
            className="absolute top-[10%] left-[20%] w-[30%] h-[30%] rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)",
            }}
          />
        </div>

        {/* Orbit ring 1 */}
        <div
          className="absolute inset-[-10%] rounded-full border border-cyan-500/[0.06]"
          style={{ animation: "spin-slow 30s linear infinite" }}
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-cyan-400/50" />
        </div>

        {/* Orbit ring 2 */}
        <div
          className="absolute inset-[-20%] rounded-full border border-red-500/[0.04]"
          style={{ animation: "spin-slow 45s linear infinite reverse" }}
        >
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 h-1 w-1 rounded-full bg-red-400/40" />
        </div>
      </div>

      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
