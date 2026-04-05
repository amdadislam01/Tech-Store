"use client";

import { Shield, Lock, Eye, CheckCircle2, ChevronRight, Mail, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

export default function PrivacyPage() {
  const [activeSection, setActiveSection] = useState("collection");

  const sections = [
    { id: "collection", title: "Data Collection", icon: Eye, color: "text-blue-600", bg: "bg-blue-50" },
    { id: "usage", title: "How We Use It", icon: Lock, color: "text-emerald-600", bg: "bg-emerald-50" },
    { id: "control", title: "Your Control", icon: Shield, color: "text-violet-600", bg: "bg-violet-50" },
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
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl" />
        
        <div className="container-custom relative">
          <div className="max-w-3xl mx-auto text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary rounded-full text-[11px] font-black uppercase tracking-[0.2em] border border-primary/20 shadow-sm">
              <Shield size={14} className="animate-pulse" />
              <span>Identity Protection Protocol</span>
            </div>
            
            <h1 className="text-5xl sm:text-7xl font-black text-foreground tracking-tight leading-[1.1]">
              Privacy <span className="text-primary italic">Matters.</span>
            </h1>
            
            <p className="text-xl text-gray-500 font-medium leading-relaxed max-w-2xl mx-auto">
              Our commitment to your data security is absolute. We handle your information with the same integrity we bring to our hardware.
            </p>

            <div className="flex items-center justify-center gap-4 text-[10px] text-gray-400 font-bold uppercase tracking-widest pt-4">
              <span className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-primary" /> GDPR Compliant</span>
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
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Need Clarity?</p>
              <p className="text-xs text-gray-500 leading-relaxed font-medium">Our legal team is available for any specific data inquiries you may have.</p>
              <a href="mailto:privacy@techstore.com" className="inline-flex items-center gap-2 text-primary font-bold text-xs hover:gap-3 transition-all">
                Email Support <ArrowRight size={14} />
              </a>
            </div>
          </aside>

          {/* Main Content */}
          <div className="space-y-24">
            
            {/* Section 1: Data Collection */}
            <section id="collection" className="scroll-mt-32 group">
              <div className="flex items-center gap-5 mb-8">
                <div className="w-14 h-14 rounded-[1.5rem] bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shadow-sm transition-transform duration-500 group-hover:rotate-[10deg]">
                  <Eye size={28} />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-foreground tracking-tight">Data Intelligence</h2>
                  <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">What We Collect</p>
                </div>
              </div>

              <div className="glass-morphism rounded-[2.5rem] p-8 sm:p-12 shadow-premium hover:shadow-premium-hover transition-all duration-500">
                <div className="grid sm:grid-cols-2 gap-12">
                  <div className="space-y-6">
                    <p className="text-lg text-gray-600 leading-relaxed font-medium">
                      Information gathering is restricted to the absolute essentials required for service delivery and ecosystem optimization.
                    </p>
                    <ul className="space-y-4">
                      {[
                        { title: "Core Identity", desc: "Legal name and contact matrix." },
                        { title: "Logistics Data", desc: "Precision shipping coordinates." },
                        { title: "Secure Credentials", desc: "Vaulted authentication data." }
                      ].map((item, idx) => (
                        <li key={idx} className="flex gap-4">
                          <div className="mt-1.5 w-2 h-2 rounded-full bg-blue-500 shrink-0 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                          <div>
                            <span className="block text-sm font-black text-foreground uppercase tracking-tight">{item.title}</span>
                            <span className="text-sm text-gray-500 font-medium">{item.desc}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-blue-50/50 rounded-3xl p-8 border border-blue-100/50 flex flex-col justify-center text-center space-y-4">
                    <div className="text-4xl font-black text-blue-600">Zero</div>
                    <p className="text-sm text-blue-600/70 font-bold uppercase tracking-widest leading-tight">Third Party<br/>Data Sales</p>
                    <div className="pt-4 text-[10px] text-blue-400 font-medium">Your data stays within the Tech-Store ecosystem. Always.</div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 2: Usage */}
            <section id="usage" className="scroll-mt-32 group">
              <div className="flex items-center gap-5 mb-8">
                <div className="w-14 h-14 rounded-[1.5rem] bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shadow-sm transition-transform duration-500 group-hover:rotate-[-10deg]">
                  <Lock size={28} />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-foreground tracking-tight">Purposeful Usage</h2>
                  <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">How We Use It</p>
                </div>
              </div>

              <div className="glass-morphism rounded-[2.5rem] p-8 sm:p-12 shadow-premium hover:shadow-premium-hover transition-all duration-500 border-emerald-100/40">
                <div className="space-y-8">
                  <p className="text-xl text-gray-600 leading-relaxed font-medium">
                    Utilization is strictly functional. We leverage your data to process high-security transactions via Stripe, automate your logistics tracking, and—only with explicit consent—curate product release notifications.
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                      { label: "Encrypted", icon: Shield },
                      { label: "Authorized", icon: Lock },
                      { label: "Optimized", icon: Eye },
                      { label: "Verified", icon: CheckCircle2 }
                    ].map((badge, idx) => (
                      <div key={idx} className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-emerald-50/30 border border-emerald-100/50">
                        <badge.icon size={20} className="text-emerald-600" />
                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{badge.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3: Control */}
            <section id="control" className="scroll-mt-32 group">
              <div className="flex items-center gap-5 mb-8">
                <div className="w-14 h-14 rounded-[1.5rem] bg-violet-50 text-violet-600 flex items-center justify-center border border-violet-100 shadow-sm transition-transform duration-500 group-hover:scale-110">
                  <Shield size={28} />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-foreground tracking-tight">Absolute Authority</h2>
                  <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">Your Data, Your Rules</p>
                </div>
              </div>

              <div className="glass-morphism rounded-[2.5rem] p-8 sm:p-12 shadow-premium hover:shadow-premium-hover transition-all duration-500 border-violet-100/40">
                <p className="text-lg text-gray-600 leading-relaxed font-medium mb-10">
                  Full sovereignty over your digital footprint is not a feature—it's a requirement. You retain the right to audit, extract, or dissolve your data at any moment.
                </p>
                <div className="grid sm:grid-cols-3 gap-6">
                  {[
                    { title: "Edit", action: "Instant Profile Correction" },
                    { title: "Export", action: "Full Data Portability" },
                    { title: "Erase", action: "Permanent Deletion Rights" }
                  ].map((ctrl, idx) => (
                    <div key={idx} className="p-6 rounded-[2rem] border border-violet-100/60 bg-violet-50/10 space-y-2 hover:bg-violet-50/30 transition-colors">
                      <h4 className="text-lg font-black text-violet-600 tracking-tight">{ctrl.title}</h4>
                      <p className="text-xs text-gray-500 font-bold leading-relaxed">{ctrl.action}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Premium CTA Card */}
            <div className="relative group overflow-hidden bg-foreground text-white rounded-[3rem] p-10 sm:p-16 shadow-2xl">
              <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 transition-transform duration-700 group-hover:scale-125" />
              
              <div className="relative flex flex-col md:flex-row gap-12 items-center text-center md:text-left">
                <div className="flex-1 space-y-6">
                  <h3 className="text-4xl font-black tracking-tight leading-tight">Need a Deep Dive?</h3>
                  <p className="text-gray-400 font-medium text-lg leading-relaxed max-w-xl">
                    Our specialized privacy officers are ready to assist with any complex data inquiries or compliance questions you may have.
                  </p>
                </div>
                <div className="shrink-0 space-y-4">
                  <button className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-5 bg-primary text-white rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all">
                    <Mail size={18} />
                    Contact Team
                  </button>
                  <p className="text-[10px] text-gray-500 text-center font-bold tracking-[0.2em] uppercase">Response time: ~24 Hours</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
