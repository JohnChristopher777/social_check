import React, { useState, useRef } from 'react';
import { 
  ArrowLeft, 
  Smartphone, 
  Image as ImageIcon, 
  CheckCircle, 
  AlertTriangle, 
  ShieldCheck, 
  X, 
  Lock,
} from 'lucide-react';

interface GuidelinesPageProps {
  onBack: () => void;
}

export default function GuidelinesPage({ onBack }: GuidelinesPageProps) {
  const [activeSection, setActiveSection] = useState('adoption');
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { id: 'adoption', label: 'Recent Additions in Modern Cybersecurity Contexts' },
    { id: 'mfa', label: 'Multi-Factor Authentication (2FA)' },
    { id: 'profile', label: 'Profile Pictures & Metadata' },
    { id: 'geo', label: 'Geolocation & Absence Leakage' },
    { id: 'passwords', label: 'Password Creation Mastery' },
    { id: 'hijack', label: 'In Event of Account Hijack' },
  ];

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const scrollHeight = target.scrollHeight - target.clientHeight;
    const progress = (target.scrollTop / scrollHeight) * 100;
    setScrollProgress(progress);
    
    // Auto-update active section based on scroll position
    const sectionElements = navItems.map(item => document.getElementById(item.id));
    for (let i = sectionElements.length - 1; i >= 0; i--) {
        const el = sectionElements[i];
        if (el && target.scrollTop >= (el.offsetTop - 200)) {
            setActiveSection(navItems[i].id);
            break;
        }
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el && containerRef.current) {
        containerRef.current.scrollTo({
            top: el.offsetTop - 100,
            behavior: 'smooth'
        });
    }
  };

  return (
    <div 
       ref={containerRef}
       onScroll={handleScroll}
       className="fixed inset-0 z-50 bg-[#07051A] overflow-y-auto w-screen h-screen text-slate-300 pointer-events-auto scroll-smooth custom-scrollbar"
    >
      {/* Top Navbar */}
      <nav className="sticky top-0 z-40 bg-[#07051A]/80 backdrop-blur-xl border-b border-white/5 py-4 px-6 md:px-12 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex flex-col items-center justify-center overflow-hidden">
            <img src="/logo.png" alt="Logo" className="w-[120%] h-[120%] object-contain" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            Social Check <span className="hidden sm:inline bg-clip-text text-transparent bg-gradient-to-r from-[#1DA1F2] to-[#AD55FF] font-medium text-lg">| Guidelines</span>
          </h1>
        </div>
        
        <button 
          onClick={onBack} 
          className="flex items-center gap-2 px-5 py-2 md:py-2.5 bg-white/5 hover:bg-white/10 text-white font-bold text-xs tracking-wide rounded-full transition-all border border-white/10 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Analyzer
        </button>
      </nav>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 md:px-12 py-12 flex flex-col lg:flex-row gap-12 lg:gap-16">
        
        {/* Left Sidebar (Table of Contents) */}
        <aside className="lg:w-64 shrink-0 font-sans space-y-6 lg:sticky lg:top-28 h-fit">
          <div className="border-b border-white/10 pb-4 mb-4">
            <h2 className="text-xl font-black text-white">12 Min Read</h2>
            <div className="w-full h-1.5 bg-black/40 rounded-full mt-3 overflow-hidden border border-white/5">
              <div 
                className="h-full bg-gradient-to-r from-[#1DA1F2] to-[#AD55FF] rounded-full transition-all duration-300 ease-out"
                style={{ width: `${scrollProgress}%` }}
              ></div>
            </div>
          </div>
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => scrollToSection(item.id)}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all font-medium text-sm ${
                    activeSection === item.id 
                      ? 'bg-gradient-to-r from-[#AD55FF]/20 to-transparent text-[#D9AAFF] border-l-4 border-[#AD55FF] font-bold' 
                      : 'text-slate-400 hover:text-white hover:bg-white/5 border-l-4 border-transparent'
                  }`}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Center Content Section */}
        <div className="flex-1 space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">

          <section id="adoption" className="space-y-6">
             <h2 className="text-3xl md:text-4xl font-black text-white leading-tight">
               Adoption of Defense-in-Depth Protocols
             </h2>
             <p className="text-[15px] leading-relaxed opacity-90">
               Modern cyber intelligence relies almost exclusively on Open Source Intelligence (OSINT). Threat actors rapidly aggregate small snippets from disconnected profiles—Instagram photos, LinkedIn updates, and Twitter check-ins. By combining the data, they derive <span className="text-[#AD55FF] font-bold bg-[#AD55FF]/10 px-1 rounded">Target Architecture</span>.
             </p>
             <p className="text-[15px] leading-relaxed opacity-90">
               With recent additions in AI capabilities like deep-fake processing and large-language model context scraping, minimizing your digital footprint is no longer a luxury—it’s an operationally vital directive.
             </p>
             <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl mt-6 relative group">
               <img src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200&auto=format&fit=crop" className="w-full h-64 object-cover opacity-80 group-hover:opacity-100 transition-opacity" alt="Cybersecurity" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
                 <p className="text-white font-bold tracking-wide">Machine-Readable Exploitation in Real-Time</p>
               </div>
             </div>
          </section>

          {/* MFA Section */}
          <section id="mfa" className="p-8 bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-2xl shadow-inner relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#1DA1F2] blur-[150px] opacity-10"></div>
            <h3 className="text-2xl font-bold text-[#1DA1F2] mb-4 flex items-center gap-3 relative z-10"><Smartphone className="w-6 h-6" /> Multi-Factor Authentication (2FA)</h3>
            <p className="opacity-90 leading-relaxed mb-4 text-[15px] relative z-10">
              Do not rely solely on passwords. You must use Authenticator Apps (Google Authenticator, Authy, or Duo) across all major platforms. SMS 2FA is highly vulnerable to <span className="text-white font-black underline decoration-[#1DA1F2] decoration-2 underline-offset-4 bg-white/5 px-1 pb-0.5 rounded">SIM-Swapping Attacks</span>.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10 mt-6">
              <div className="flex items-start gap-3 bg-black/40 p-4 rounded-xl border border-white/5">
                <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
                <p className="text-sm">Download your emergency backup codes immediately after setup and keep them offline.</p>
              </div>
              <div className="flex items-start gap-3 bg-black/40 p-4 rounded-xl border border-white/5">
                <ShieldCheck className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
                <p className="text-sm">Prefer Physical Security Keys (YubiKey) for high-value targets and administration portals.</p>
              </div>
            </div>
          </section>

          {/* Profile & Metadata Section */}
          <section id="profile" className="p-8 bg-gradient-to-bl from-white/5 to-transparent border border-white/10 rounded-2xl shadow-inner relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#AD55FF] blur-[150px] opacity-10"></div>
            <h3 className="text-2xl font-bold text-[#D9AAFF] mb-4 flex items-center gap-3 relative z-10"><ImageIcon className="w-6 h-6" /> Profile Pictures & Metadata</h3>
            <p className="opacity-90 leading-relaxed mb-4 text-[15px] relative z-10">
              <span className="text-[#D9AAFF] font-bold">Reverse Image Search</span> is weaponized heavily. Avoid using the exact same profile picture across LinkedIn, Instagram, and Reddit, as it links your compartmented profiles into a singular target identity matrix.
            </p>
            <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl my-6">
               <img src="https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=1200&auto=format&fit=crop" className="w-full h-48 object-cover opacity-80" alt="Networking Matrix" />
            </div>
            <p className="opacity-90 leading-relaxed text-[15px] relative z-10">
              Never upload original mobile pictures directly to unencrypted forums without stripping EXIF metadata, which explicitly holds your exact GPS coordinates and device hardware MAC fingerprints.
            </p>
          </section>

          {/* Geolocation Section */}
          <section id="geo" className="p-8 bg-gradient-to-r from-red-500/5 to-transparent border border-l-4 border-l-[#FF0055] border-white/10 rounded-2xl shadow-inner mt-12">
            <h3 className="text-2xl font-bold text-[#FF0055] mb-4 flex items-center gap-3"><AlertTriangle className="w-6 h-6" /> Geolocation & Absence Leakage</h3>
            <p className="opacity-90 leading-relaxed text-[15px] mb-4">
              Posting pictures from a vacation while you are actively there broadcasts a <span className="font-bold text-[#FF0055]">Zero Occupancy</span> signal to physical threats. Synchronizing digital tags with physical locations opens avenues for immediate stalking or burglary. Professional OSINT analysts refer to this as Temporal Vulnerability mapping.
            </p>
            <p className="opacity-90 leading-relaxed text-[15px] mb-6">
              Wait until you have returned to your primary residence to syndicate large albums. Furthermore, disable background geolocation tagging natively in your camera application parameters, as invisible EXIF data embeds exactly where and when an asset was captured.
            </p>
            <div className="rounded-xl overflow-hidden shadow-2xl h-64 border border-white/10 relative">
               <img src="https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=1200&auto=format&fit=crop" className="w-full h-full object-cover" alt="Cyber Code and Hardware" />
               <div className="absolute bottom-4 left-4 bg-black/80 px-3 py-1.5 rounded border border-white/10">
                 <p className="text-xs text-white font-mono">LAT: 34.0522  LONG: -118.2437</p>
               </div>
            </div>
          </section>

          {/* Password Creation */}
          <section id="passwords" className="p-8 bg-black/40 border border-white/10 rounded-2xl shadow-inner mt-12 bg-gradient-to-br from-green-500/5 to-transparent">
            <h2 className="text-3xl font-black text-white mb-6 flex items-center gap-3"><Lock className="w-8 h-8 text-[#00FF88]" /> Password Mastery</h2>
            <ul className="space-y-4 text-slate-300 list-none ml-0">
              <li className="flex gap-4 items-start bg-white/5 p-4 rounded-xl border border-white/5">
                <X className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" /> 
                <span className="text-[15px]">Never use Dates of Birth (DOB), Phone Numbers, or ID portions.</span>
              </li>
              <li className="flex gap-4 items-start bg-white/5 p-4 rounded-xl border border-white/5">
                <X className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" /> 
                <span className="text-[15px]">Never use names of pets, first cars, or hometowns (these answer automated 'Credential Recovery' questions).</span>
              </li>
              <li className="flex gap-4 items-start bg-white/5 p-4 rounded-xl border border-white/5">
                <CheckCircle className="w-5 h-5 text-[#00FF88] shrink-0 mt-0.5" /> 
                <span className="text-[15px]">Use Passphrases instead. <span className="font-mono bg-black px-2 py-1 rounded border border-white/10 mx-1 text-white">BlueCoffeeCups1!</span> is exponentially harder to crack than <span className="font-mono bg-black px-2 py-1 rounded border border-white/10 mx-1 text-white opacity-80 line-through">P@ssw0rd99</span>.</span>
              </li>
              <li className="flex gap-4 items-start bg-white/5 p-4 rounded-xl border border-white/5">
                <CheckCircle className="w-5 h-5 text-[#00FF88] shrink-0 mt-0.5" /> 
                <span className="text-[15px]">Use a Password Manager (1Password/Bitwarden) so every single platform gets an isolated 20-character string.</span>
              </li>
            </ul>
          </section>

          {/* Account Hijack Section */}
          <section id="hijack" className="p-8 bg-black/40 border border-white/10 rounded-2xl shadow-inner mt-12">
            <h2 className="text-3xl font-black text-rose-400 mb-6 flex items-center gap-3"><ShieldCheck className="w-8 h-8" /> In Event of Account Hijack</h2>
            <p className="text-[15px] text-slate-300 mb-6 leading-relaxed">
              If an attacker bypasses your initial defenses and modifies your master email address, panic is the enemy. The immediate subsequent phases are critical for containment and asset recovery:
            </p>
            <div className="space-y-4">
               <div className="p-5 bg-white/5 rounded-xl border border-white/5 flex gap-5 hover:bg-white/10 transition-colors">
                 <div className="w-10 h-10 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center font-black shrink-0 shadow-inner">1</div>
                 <div>
                   <p className="text-[15px] mb-1"><strong className="text-white">Isolate Banking Auth.</strong></p>
                   <p className="text-sm text-slate-400 leading-relaxed">Freeze digital cards linked to social E-commerce stores instantaneously. Hackers routinely purchase localized ad-spend using your attached credentials to drain daily limits.</p>
                 </div>
               </div>
               
               <div className="p-5 bg-white/5 rounded-xl border border-white/5 flex gap-5 hover:bg-white/10 transition-colors">
                 <div className="w-10 h-10 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center font-black shrink-0 shadow-inner">2</div>
                 <div>
                   <p className="text-[15px] mb-1"><strong className="text-white">Intercept Verification.</strong></p>
                   <p className="text-sm text-slate-400 leading-relaxed">Locate the original "Email was Changed" warning sent to the breached inbox from the platform. Selecting the official "Secure My Account" link rapidly locks the profile state, ejecting the active attacker session.</p>
                 </div>
               </div>

               <div className="p-5 bg-white/5 rounded-xl border border-white/5 flex gap-5 hover:bg-white/10 transition-colors">
                 <div className="w-10 h-10 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center font-black shrink-0 shadow-inner">3</div>
                 <div>
                   <p className="text-[15px] mb-1"><strong className="text-white">Secure Identity Flow.</strong></p>
                   <p className="text-sm text-slate-400 leading-relaxed">Never negotiate with extortion demands. Route recovery explicitly through official encrypted platform channels using government ID uploads. Do not engage "Recovery Services" advertised in comments; they are secondary scam operations targeting desperate victims.</p>
                 </div>
               </div>
            </div>
          </section>

        </div>

        {/* Right Sidebar (Audits and Action Cards) */}
        <aside className="lg:w-80 shrink-0 mt-12 lg:mt-0">
           <div className="bg-gradient-to-b from-[#110B29] to-[#0A0514] border border-[#AD55FF]/30 p-6 rounded-3xl shadow-[0_10px_40px_rgba(173,85,255,0.15)] sticky top-28 overflow-hidden group">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#1DA1F2] to-[#AD55FF]" />
             <h3 className="text-2xl font-black text-white mb-3">Enterprise OSINT Audit</h3>
             <p className="text-sm text-slate-400 leading-relaxed mb-6">
               Subject your profiles to a full-spectrum cyber investigation. Identical to tactics executed by APT groups. Real-world exploitation assessment.
             </p>

             <ul className="space-y-3 mb-8">
               <li className="flex items-center gap-3 text-sm text-slate-300">
                 <CheckCircle className="w-4 h-4 text-[#AD55FF]" /> Deep Image OCR scanning
               </li>
               <li className="flex items-center gap-3 text-sm text-slate-300">
                 <CheckCircle className="w-4 h-4 text-[#AD55FF]" /> Behavioral pattern matching
               </li>
               <li className="flex items-center gap-3 text-sm text-slate-300">
                 <CheckCircle className="w-4 h-4 text-[#AD55FF]" /> Cross-platform trajectory
               </li>
             </ul>

             <button 
               onClick={onBack}
               className="w-full py-3.5 bg-gradient-to-r from-[#1DA1F2] to-[#AD55FF] hover:opacity-90 text-white font-black text-sm tracking-wide rounded-xl transition-all shadow-[0_0_20px_rgba(173,85,255,0.4)] hover:shadow-[0_0_30px_rgba(173,85,255,0.6)] hover:-translate-y-1"
             >
               Start Threat Audit →
             </button>
           </div>
        </aside>

      </div>
    </div>
  );
}