"use client";

import { Cookie, Settings, Info, CheckCircle2, ChevronRight, ArrowRight, ShieldCheck, Heart } from "lucide-react";
import { useEffect, useState } from "react";

export default function CookiesPage() {
  const [activeSection, setActiveSection] = useState("definition");

  const sections = [
    { id: "definition", title: "What are Cookies", icon: Info, color: "text-blue-600", bg: "bg-blue-50" },
    { id: "usage", title: "How We Use Them", icon: Settings, color: "text-indigo-600", bg: "bg-indigo-50" },
    { id: "management", title: "Your Control", icon: Cookie, color: "text-amber-600", bg: "bg-amber-50" },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5 }
    );

    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <div className="min-h-screen bg-white selection:bg-primary/20">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white py-24 sm:py-32 border-b border-gray-100">
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl opacity-50" />
        
        <div className="container-custom relative">
          <div className="max-w-3xl mx-auto text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-50 text-amber-600 rounded-full text-[11px] font-black uppercase tracking-[0.2em] border border-amber-100 shadow-sm">
              <Cookie size={14} className="animate-bounce" />
              <span>Browser Intelligence</span>
            </div>
            
            <h1 className="text-5xl sm:text-7xl font-black text-foreground tracking-tight leading-[1.1]">
              Cookie <span className="text-primary italic">Policy.</span>
            </h1>
            
            <p className="text-xl text-gray-500 font-medium leading-relaxed max-w-2xl mx-auto">
              Cookies help us optimize your "Silicon Ecosystem" experience. We use them with respect and total transparency.
            </p>

            <div className="flex items-center justify-center gap-4 text-[10px] text-gray-400 font-bold uppercase tracking-widest pt-4">
              <span className="flex items-center gap-1.5"><ShieldCheck size={12} className="text-primary" /> Privacy Verified</span>
              <span className="w-1 h-1 bg-gray-300 rounded-full" />
              <span>Updated April 5, 2026</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom py-20 lg:py-32">
        <div className="grid lg:grid-cols-[280px_1fr] gap-20 items-start">
          
          {/* Sticky Sidebar Nav */}
          <aside className="sticky top-32 hidden lg:block space-y-8">
            <nav className="space-y-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-300 group
                    ${activeSection === section.id 
                      ? "bg-primary text-white shadow-lg shadow-primary/25 translate-x-2" 
                      : "hover:bg-gray-50 text-gray-500"}`}
                >
                  <span className="text-sm font-bold tracking-tight">{section.title}</span>
                  <ChevronRight size={16} className={`transition-transform duration-300 ${activeSection === section.id ? "rotate-90" : "group-hover:translate-x-1"}`} />
                </button>
              ))}
            </nav>
            
            <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 space-y-4">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Helpful Info</p>
              <p className="text-xs text-gray-500 leading-relaxed font-medium">Disabling essential cookies may interrupt your core shopping experience.</p>
              <button className="inline-flex items-center gap-2 text-primary font-bold text-xs hover:gap-3 transition-all">
                Browser Guide <ArrowRight size={14} />
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <div className="space-y-24">
            
            {/* Section 1: Definition */}
            <section id="definition" className="scroll-mt-32 group">
              <div className="flex items-center gap-5 mb-8">
                <div className="w-14 h-14 rounded-[1.5rem] bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shadow-sm transition-transform duration-500 group-hover:rotate-[10deg]">
                  <Info size={28} />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-foreground tracking-tight">Understanding Cookies</h2>
                  <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">Platform Integrity</p>
                </div>
              </div>

              <div className="glass-morphism rounded-[2.5rem] p-8 sm:p-12 shadow-premium hover:shadow-premium-hover transition-all duration-500 border-blue-100/40">
                <p className="text-xl text-gray-600 leading-relaxed font-medium">
                  Cookies are precision text fragments stored by your browser. They are non-executable data entities that allow us to maintain a seamless, personalized state during your interaction with our hardware ecosystem.
                </p>
              </div>
            </section>

            {/* Section 2: Usage */}
            <section id="usage" className="scroll-mt-32 group">
              <div className="flex items-center gap-5 mb-8">
                <div className="w-14 h-14 rounded-[1.5rem] bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 shadow-sm transition-transform duration-500 group-hover:scale-110">
                  <Settings size={28} />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-foreground tracking-tight">Deployment Strategy</h2>
                  <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">How We Use Them</p>
                </div>
              </div>

              <div className="space-y-6">
                {[
                  { 
                    title: "Essential Core", 
                    desc: "Critical for authentication and cart maintenance. Without these, the platform's core logic cannot function.", 
                    icon: ShieldCheck, 
                    color: "text-emerald-600", 
                    bg: "bg-emerald-50" 
                  },
                  { 
                    title: "Performance Metrics", 
                    desc: "Anonymous data points that help us optimize load times and navigating flows within the Silicon Ecosystem.", 
                    icon: Settings, 
                    color: "text-blue-600", 
                    bg: "bg-blue-50" 
                  },
                  { 
                    title: "Personalization", 
                    desc: "Remembering your currency, theme preferences, and localized settings for a custom-tailored experience.", 
                    icon: Heart, 
                    color: "text-purple-600", 
                    bg: "bg-purple-50" 
                  }
                ].map((type, idx) => (
                  <div key={idx} className="glass-morphism rounded-3xl p-8 shadow-premium group/card hover:bg-gray-50/50 transition-all duration-300">
                    <div className="flex gap-6 items-start">
                      <div className={`w-12 h-12 rounded-2xl ${type.bg} ${type.color} flex items-center justify-center shrink-0 border border-current/10`}>
                        <type.icon size={22} />
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-lg font-black text-foreground uppercase tracking-tight">{type.title}</h4>
                        <p className="text-sm text-gray-500 font-medium leading-relaxed">{type.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 3: Management */}
            <section id="management" className="scroll-mt-32 group">
              <div className="flex items-center gap-5 mb-8">
                <div className="w-14 h-14 rounded-[1.5rem] bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100 shadow-sm transition-transform duration-500 group-hover:rotate-[-10deg]">
                  <Cookie size={28} />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-foreground tracking-tight">Authority & Control</h2>
                  <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">Manage Your Data</p>
                </div>
              </div>

              <div className="glass-morphism rounded-[2.5rem] p-8 sm:p-12 shadow-premium hover:shadow-premium-hover transition-all duration-500 border-amber-100/40">
                <div className="space-y-10">
                  <p className="text-lg text-gray-600 leading-relaxed font-medium">
                    You maintain total sovereignty over your browser settings. Through your security preferences, you can audit, block, or dissolve any data fragments we deploy.
                  </p>
                  
                  <div className="p-8 bg-gray-50 rounded-[3rem] border border-gray-100 flex flex-col md:flex-row items-center gap-10">
                    <div className="flex-1 space-y-4 text-center md:text-left">
                      <h4 className="text-xl font-black tracking-tight">Precision Settings</h4>
                      <p className="text-sm text-gray-500 font-medium">Configure your ecosystem journey with granular control over optional data collection.</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 shrink-0">
                      <button className="px-8 py-4 bg-white border border-gray-200 text-gray-700 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-gray-50 transition-all">Audit All</button>
                      <button className="px-8 py-4 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/25 hover:scale-105 active:scale-95 transition-all">Synchronize Custom</button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Final Agreement Gradient Card */}
            <div className="relative group overflow-hidden bg-foreground text-white rounded-[3rem] p-10 sm:p-16 shadow-2xl">
              <div className="absolute top-0 right-0 w-full h-full bg-[conic-gradient(from_225deg_at_50%_50%,rgba(34,197,94,0.1),transparent)] pointer-events-none" />
              <div className="absolute -top-24 -left-24 w-80 h-80 bg-amber-500/10 rounded-full blur-[100px] transition-transform duration-1000 group-hover:scale-125" />
              
              <div className="relative flex flex-col md:flex-row gap-12 items-center">
                <div className="flex-1 space-y-6 text-center md:text-left">
                  <h3 className="text-4xl font-black tracking-tight leading-tight">Proceed with Confidence</h3>
                  <p className="text-gray-400 font-medium text-lg leading-relaxed max-w-xl">
                    By continuing your discovery of Tech-Store, you acknowledge our specialized use of browser data fragments to enhance your journey.
                  </p>
                </div>
                <div className="shrink-0">
                   <button className="px-12 py-6 bg-primary text-white rounded-2xl text-sm font-black uppercase tracking-widest shadow-2xl shadow-primary/40 hover:brightness-110 transition-all">
                     Confirm & Continue
                   </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
