"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send, MessageCircle, HelpCircle, ChevronDown, Sparkles, Zap, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
    {
        question: "How long does shipping take?",
        answer: "Shipping typically takes 3-5 business days for domestic orders and 7-14 days for international shipping. You'll receive a tracking number as soon as your order leaves our warehouse."
    },
    {
        question: "What is your return policy?",
        answer: "We offer a 30-day hassle-free return policy. If you're not completely satisfied with your purchase, you can return it in its original packaging for a full refund or exchange."
    },
    {
        question: "Are your products covered by warranty?",
        answer: "Yes! All electronic devices come with a standard 12-month manufacturer warranty. Some premium brands offer extended warranties up to 24 months."
    },
    {
        question: "Do you offer technical support for setup?",
        answer: "Absolutely. Our technical team is available 24/7 via live chat or phone to help you configure your new devices and troubleshoot any initial connectivity issues."
    }
];

export default function SupportPage() {
    const [search, setSearch] = useState("");
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success">("idle");

    const filteredFaqs = faqs.filter(f => 
        f.question.toLowerCase().includes(search.toLowerCase()) || 
        f.answer.toLowerCase().includes(search.toLowerCase())
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFormStatus("submitting");
        setTimeout(() => {
            setFormStatus("success");
            setTimeout(() => setFormStatus("idle"), 5000);
        }, 1500);
    };

    return (
        <div className="bg-[#F8FAFC] min-h-screen pb-24">
            {/* Hero Section */}
            <section className="bg-primary pt-24 pb-48 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48 blur-3xl" />
                <div className="container-custom text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border border-white/20"
                    >
                        <MessageCircle size={14} className="text-primary-light" />
                        <span>How can we help you today?</span>
                    </motion.div>
                    <h1 className="text-5xl md:text-6xl font-black mb-8 tracking-tighter">Help <span className="text-primary-light">Center</span></h1>
                    <div className="max-w-2xl mx-auto relative group">
                        <div className="absolute inset-0 bg-white shadow-2xl rounded-3xl blur-xl opacity-0 group-focus-within:opacity-20 transition-opacity" />
                        <HelpCircle className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={22} />
                        <input 
                            type="text" 
                            placeholder="Search help articles (shipping, returns, warranty...)" 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-16 pr-6 py-5 rounded-3xl text-foreground bg-white shadow-lg focus:outline-none focus:ring-4 focus:ring-white/20 transition-all font-medium text-lg relative z-10"
                        />
                    </div>
                </div>
            </section>

            {/* Support Content */}
            <div className="container-custom -mt-24 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* FAQ Section */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white p-8 md:p-12 rounded-[40px] shadow-2xl shadow-gray-200/50 border border-gray-100">
                            <h2 className="text-2xl font-black text-foreground mb-8 flex items-center gap-3 tracking-tight">
                                <Zap className="text-primary" size={24} />
                                Frequently Asked Questions
                            </h2>
                            <div className="space-y-4">
                                {filteredFaqs.length > 0 ? (
                                    filteredFaqs.map((faq, i) => (
                                        <div key={i} className="border-b border-gray-50 last:border-0 pb-4">
                                            <button 
                                                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                                className="w-full flex items-center justify-between py-4 text-left group"
                                            >
                                                <span className={`font-bold transition-colors ${openFaq === i ? "text-primary text-lg" : "text-gray-600 group-hover:text-primary"}`}>
                                                    {faq.question}
                                                </span>
                                                <ChevronDown size={20} className={`text-gray-400 transition-transform duration-300 ${openFaq === i ? "rotate-180 text-primary" : ""}`} />
                                            </button>
                                            <AnimatePresence>
                                                {openFaq === i && (
                                                    <motion.div 
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: "auto", opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        className="overflow-hidden"
                                                    >
                                                        <p className="text-gray-500 font-medium leading-relaxed pb-4 pr-8">
                                                            {faq.answer}
                                                        </p>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-12 text-center">
                                        <p className="text-gray-400 font-bold">No matching help articles found.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="bg-white p-8 md:p-12 rounded-[40px] shadow-2xl shadow-gray-200/50 border border-gray-100 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl" />
                            <h2 className="text-2xl font-black text-foreground mb-8 flex items-center gap-3 tracking-tight">
                                <Mail className="text-primary" size={24} />
                                Direct Message
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Full Name</label>
                                        <input 
                                            required
                                            type="text" 
                                            placeholder="John Doe" 
                                            className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold text-sm"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Email Address</label>
                                        <input 
                                            required
                                            type="email" 
                                            placeholder="john@example.com" 
                                            className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold text-sm"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Message Detail</label>
                                    <textarea 
                                        required
                                        rows={5}
                                        placeholder="How can we assist you?" 
                                        className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold text-sm resize-none"
                                    />
                                </div>
                                <button 
                                    disabled={formStatus !== "idle"}
                                    type="submit" 
                                    className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest text-sm transition-all shadow-xl flex items-center justify-center gap-3 ${
                                        formStatus === "success" 
                                        ? "bg-green-500 text-white shadow-green-200" 
                                        : "bg-primary text-white shadow-primary/30 hover:-translate-y-1 active:scale-95"
                                    }`}
                                >
                                    {formStatus === "submitting" ? (
                                        <motion.div 
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                            className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                                        />
                                    ) : formStatus === "success" ? (
                                        <>
                                            <ShieldCheck size={20} />
                                            Message Sent!
                                        </>
                                    ) : (
                                        <>
                                            <Send size={18} />
                                            Send Message
                                        </>
                                    )}
                                </button>
                                {formStatus === "success" && (
                                    <p className="text-center text-green-500 text-xs font-bold animate-bounce mt-4">We'll get back to you within 24 hours!</p>
                                )}
                            </form>
                        </div>
                    </div>

                    {/* Contact Sidebar */}
                    <aside className="space-y-6">
                        <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-xl shadow-gray-200/30 group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 mb-6 group-hover:scale-110 transition-transform">
                                <Phone size={28} />
                            </div>
                            <h3 className="text-xl font-black text-foreground tracking-tight mb-2 text-balance">Support Hotline</h3>
                            <p className="text-gray-400 text-sm font-medium mb-4">Direct line for instant technical assistance.</p>
                            <p className="text-primary text-xl font-black">+880 1234-567890</p>
                        </div>

                        <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-xl shadow-gray-200/30 group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                            <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-500 mb-6 group-hover:scale-110 transition-transform">
                                <Mail size={28} />
                            </div>
                            <h3 className="text-xl font-black text-foreground tracking-tight mb-2 text-balance">Email Help Desk</h3>
                            <p className="text-gray-400 text-sm font-medium mb-4">Expect a detailed response within 1 business day.</p>
                            <p className="text-primary text-xl font-black">support@techstore.com</p>
                        </div>

                        <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-xl shadow-gray-200/30 group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                            <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500 mb-6 group-hover:scale-110 transition-transform">
                                <MapPin size={28} />
                            </div>
                            <h3 className="text-xl font-black text-foreground tracking-tight mb-2 text-balance">Global HQ</h3>
                            <p className="text-gray-400 text-sm font-medium mb-4">Visit our tech hub in the heart of the city.</p>
                            <p className="text-primary text-xl font-black">Dhaka, Bangladesh</p>
                        </div>

                        <div className="bg-primary p-10 rounded-[40px] text-white shadow-2xl shadow-primary/20 relative overflow-hidden group">
                            <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full group-hover:scale-110 transition-transform duration-1000" />
                            <Sparkles className="text-yellow-400 mb-6" size={32} />
                            <h3 className="text-2xl font-black tracking-tight mb-4">Live Resolution</h3>
                            <p className="text-white/70 text-sm font-medium leading-relaxed mb-8">Our expert engineers are online right now to solve your hardware queries.</p>
                            <button className="w-full py-4 bg-white text-primary rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:-translate-y-1 transition-all">Start Live Chat</button>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
