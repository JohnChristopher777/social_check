export function Aura({ level, embed }: { level?: 'Safe' | 'Moderate Risk' | 'High Risk', embed?: boolean }) {
  
  // Decide color palette based on score level
  let baseColor1 = "#4800FF";
  let baseColor2 = "#AD55FF";
  let baseColor3 = "#00C2FF";

  if (level === 'Safe') {
    baseColor1 = "#00FF88"; // Bright Green
    baseColor2 = "#00C2FF"; // Cyan
    baseColor3 = "#00FF88"; 
  } else if (level === 'Moderate Risk') {
    baseColor1 = "#FF9900"; // Orange
    baseColor2 = "#FFD700"; // Yellow
    baseColor3 = "#FF9900";
  } else if (level === 'High Risk') {
    baseColor1 = "#FF0055"; // Bright Red
    baseColor2 = "#FF3366"; // Crimson
    baseColor3 = "#FF0055";
  }

  const containerStyle = embed 
    ? "absolute inset-0 rounded-[inherit] z-0 pointer-events-none overflow-hidden transition-colors duration-1000"
    : "fixed inset-0 z-[-1] pointer-events-none bg-[#05050A] overflow-hidden transition-colors duration-1000";

  return (
    <div className={containerStyle}>
      {/* Deep cosmic background only if not embedded */}
      {!embed && <div className="absolute inset-0 bg-[#0A001F] opacity-80" />}
      
      {/* Heavy movement glowing orbs using CSS animations */}
      <div 
        className="absolute w-[800px] h-[800px] left-[-200px] top-[-200px] rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-blob transition-colors duration-2000" 
        style={{ backgroundColor: baseColor1 }}
      />
      <div 
        className="absolute w-[600px] h-[600px] right-[-100px] top-[-100px] rounded-full mix-blend-screen filter blur-[120px] opacity-20 animate-blob animation-delay-2000 transition-colors duration-2000" 
        style={{ backgroundColor: baseColor2 }}
      />
      <div 
        className="absolute w-[700px] h-[700px] bottom-[-200px] left-[20%] rounded-full mix-blend-screen filter blur-[150px] opacity-20 animate-blob animation-delay-4000 transition-colors duration-2000" 
        style={{ backgroundColor: baseColor3 }}
      />

      {/* Grid Mesh */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgoJPHJlY3Qgd2lkdGg9IjQiIGhlaWdodD0iNCIgZmlsbD0iI2ZmZiIgZmlsbC1vcGFjaXR5PSIwLjAzIi8+Cjwvc3ZnPg==')] opacity-50 mix-blend-overlay" />

      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(60px, -80px) scale(1.1); }
          66% { transform: translate(-40px, 40px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 15s infinite ease-in-out alternate;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 5s;
        }
      `}</style>
    </div>
  );
}
