"use client";

import { FileText, Gavel, Scale, AlertCircle, ChevronRight, ArrowRight, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";

export default function TermsPage() {
  const [activeSection, setActiveSection] = useState("responsibilities");

  const sections = [
    { id: "responsibilities", title: "User Protocol", icon: Gavel, color: "text-blue-600", bg: "bg-blue-50" },
    { id: "orders", title: "Transaction Matrix", icon: Scale, color: "text-amber-600", bg: "bg-amber-50" },
    { id: "liability", title: "Site Guardrails", icon: AlertCircle, color: "text-rose-600", bg: "bg-rose-50" },
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
        <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-72 h-72 bg-violet-500/5 rounded-full blur-3xl opacity-50" />
        
        <div className="container-custom relative">
          <div className="max-w-3xl mx-auto text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-violet-50 text-violet-600 rounded-full text-[11px] font-black uppercase tracking-[0.2em] border border-violet-100 shadow-sm">
              <FileText size={14} className="animate-pulse" />
              <span>Platform Protocol</span>
            </div>
            
            <h1 className="text-5xl sm:text-7xl font-black text-foreground tracking-tight leading-[1.1]">
              Platform <span className="text-primary italic">Rules.</span>
            </h1>
            
            <p className="text-xl text-gray-500 font-medium leading-relaxed max-w-2xl mx-auto">
              Clear, transparent, and fair. Our terms are designed to protect both the community and the creators behind Tech-Store.
            </p>

            <div className="flex items-center justify-center gap-4 text-[10px] text-gray-400 font-bold uppercase tracking-widest pt-4">
              <span className="flex items-center gap-1.5"><ShieldCheck size={12} className="text-primary" /> Verified Policy</span>
              <span className="w-1 h-1 bg-gray-300 rounded-full" />
              <span>Revision: April 5, 2026</span>
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
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Fair Play</p>
              <p className="text-xs text-gray-500 leading-relaxed font-medium">Compliance forms the bedrock of our high-integrity digital ecosystem.</p>
              <button className="inline-flex items-center gap-2 text-primary font-bold text-xs hover:gap-3 transition-all">
                Learn More <ArrowRight size={14} />
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <div className="space-y-24">
            
            {/* Section 1: User Responsibilities */}
            <section id="responsibilities" className="scroll-mt-32 group">
              <div className="flex items-center gap-5 mb-8">
                <div className="w-14 h-14 rounded-[1.5rem] bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shadow-sm transition-transform duration-500 group-hover:rotate-[10deg]">
                  <Gavel size={28} />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-foreground tracking-tight">Your Protocol</h2>
                  <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">Platform Conduct</p>
                </div>
              </div>

              <div className="glass-morphism rounded-[2.5rem] p-8 sm:p-12 shadow-premium hover:shadow-premium-hover transition-all duration-500 border-blue-100/40">
                <div className="space-y-8">
                  <p className="text-lg text-gray-600 leading-relaxed font-medium">
                    When accessing Tech-Store, you enter a commitment of mutual respect and high-performance collaboration.
                  </p>
                  <div className="grid sm:grid-cols-2 gap-10">
                    {[
                      { title: "Authentication", desc: "Use precision data when creating your digital profile." },
                      { title: "Integrity", desc: "No unauthorized automation, scraping, or interference." },
                      { title: "Respect", desc: "Professional interaction within the community." },
                      { title: "Security", desc: "Total oversight of your account's vaulted credentials." }
                    ].map((item, idx) => (
                      <div key={idx} className="space-y-2">
                        <div className="flex items-center gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                          <h4 className="text-sm font-black text-foreground uppercase tracking-tight">{item.title}</h4>
                        </div>
                        <p className="text-sm text-gray-500 font-medium leading-relaxed pl-4 border-l border-blue-100">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Section 2: Orders & Payments */}
            <section id="orders" className="scroll-mt-32 group">
              <div className="flex items-center gap-5 mb-8">
                <div className="w-14 h-14 rounded-[1.5rem] bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100 shadow-sm transition-transform duration-500 group-hover:scale-110">
                  <Scale size={28} />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-foreground tracking-tight">Transaction Matrix</h2>
                  <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">Payment Operations</p>
                </div>
              </div>

              <div className="glass-morphism rounded-[2.5rem] p-8 sm:p-12 shadow-premium hover:shadow-premium-hover transition-all duration-500 border-amber-100/40">
                <div className="grid sm:grid-cols-2 gap-12 items-center">
                  <div className="space-y-6">
                    <p className="text-lg text-gray-600 leading-relaxed font-medium">
                      Every order is a secure handshake. Prices are precise, and transactions are vaulted through Stripe for total financial security.
                    </p>
                    <div className="inline-flex flex-col p-6 rounded-3xl bg-amber-50/50 border border-amber-100/50">
                      <span className="text-2xl font-black text-amber-600">Secure Vault</span>
                      <span className="text-xs text-amber-600/70 font-bold uppercase tracking-widest">Zero Card Storage Policy</span>
                    </div>
                  </div>
                  <div className="p-8 bg-gray-50 rounded-[2rem] border border-gray-100 space-y-4">
                     <p className="text-sm text-gray-500 leading-relaxed font-medium italic">
                       "If we detect inaccuracies in pricing or stock availability during order ingestion, we reserve the right to nullify the transaction and issue an immediate correction."
                     </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3: Liability */}
            <section id="liability" className="scroll-mt-32 group">
              <div className="flex items-center gap-5 mb-8">
                <div className="w-14 h-14 rounded-[1.5rem] bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100 shadow-sm transition-transform duration-500 group-hover:rotate-[-10deg]">
                  <AlertCircle size={28} />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-foreground tracking-tight">Site Guardrails</h2>
                  <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">Liability Limitations</p>
                </div>
              </div>

              <div className="glass-morphism rounded-[2.5rem] p-8 sm:p-12 shadow-premium hover:shadow-premium-hover transition-all duration-500 border-rose-100/40">
                <div className="space-y-8">
                  <div className="p-8 bg-rose-50/30 rounded-[2.5rem] border border-rose-100/50 text-gray-600 text-lg leading-relaxed font-medium">
                    The platform is presented "as is." While we strive for absolute uptime and perfection, we cannot be held responsible for indirect or complex damages arising from digital glitches or unforeseen service interruptions.
                  </div>
                  <div className="grid sm:grid-cols-3 gap-6 text-center">
                    {["No Direct Loss", "No Data Warranty", "User Responsibility"].map((item, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-white border border-gray-100 shadow-sm">
                        <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Final Acceptance Card */}
            <div className="relative group overflow-hidden bg-foreground text-white rounded-[3rem] p-10 sm:p-16 shadow-2xl">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.15),transparent)] pointer-events-none" />
              <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-[100px] transition-transform duration-1000 group-hover:scale-125" />
              
              <div className="relative space-y-12">
                <div className="max-w-2xl space-y-6">
                  <h3 className="text-4xl font-black tracking-tight leading-tight">Acceptance Protocol</h3>
                  <p className="text-gray-400 font-medium text-lg leading-relaxed">
                    By navigating the Tech-Store ecosystem, you formally acknowledge and accept these terms. Our team is committed to evolving these rules as our community expands.
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <button className="w-full sm:w-auto px-12 py-5 bg-primary text-white rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all">
                    Agree & Synchronize
                  </button>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Last Auth: April 5, 2026</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
