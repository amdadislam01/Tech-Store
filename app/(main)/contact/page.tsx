"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  MessageSquare, 
  CheckCircle, 
  Sparkles, 
  HelpCircle, 
  Headphones, 
  Building2, 
  ShieldCheck, 
  Loader2,
  ChevronDown
} from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    topic: "General Inquiry",
    phone: "",
    orderId: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const contactCards = [
    {
      icon: Phone,
      title: "Call Us Direct",
      details: "+880 1234-TECH-00",
      subDetails: "Mon - Sun: 9:00 AM - 10:00 PM",
      actionText: "Call Now",
      href: "tel:+8801234832400",
      color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
    },
    {
      icon: Mail,
      title: "Email Support",
      details: "support@techstore.io",
      subDetails: "Average response: < 2 hours",
      actionText: "Send Mail",
      href: "mailto:support@techstore.io",
      color: "bg-blue-500/10 text-blue-600 border-blue-500/20"
    },
    {
      icon: MapPin,
      title: "Flagship Experience Hub",
      details: "Dhanmondi 27, Dhaka 1209",
      subDetails: "Tech District, Bangladesh",
      actionText: "Get Directions",
      href: "https://maps.google.com",
      color: "bg-purple-500/10 text-purple-600 border-purple-500/20"
    },
    {
      icon: MessageSquare,
      title: "WhatsApp Live Support",
      details: "+880 1700-TECH-WA",
      subDetails: "Instant messenger response",
      actionText: "Chat Now",
      href: "https://wa.me/8801700000000",
      color: "bg-amber-500/10 text-amber-600 border-amber-500/20"
    }
  ];

  const faqs = [
    {
      question: "How fast do you respond to contact inquiries?",
      answer: "Our customer support team operates 7 days a week. Email inquiries are typically answered within 2 hours, while WhatsApp and phone calls offer instant support during business hours."
    },
    {
      question: "Can I request a custom PC build quote through this form?",
      answer: "Yes! Select 'Custom PC Build Quote' as your topic, specify your budget and intended usage (gaming, rendering, AI/ML), and our hardware engineers will send you a tailored component breakdown."
    },
    {
      question: "How do I claim product warranty or request a replacement?",
      answer: "Include your Order ID in the form above and select 'Warranty & Technical Support'. Attach details of the issue and our team will issue an RMA ticket with pickup instructions."
    },
    {
      question: "Where is TechStore's physical experience center located?",
      answer: "Our flagship hub is located at Dhanmondi 27, Dhaka 1209. You can visit us to test demo rigs, inspect audio gadgets, or pick up online orders."
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all required fields (Name, Email, Message).");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSubmitted(true);
        toast.success(data.message || "Message sent successfully!");
        setFormData({
          name: "",
          email: "",
          topic: "General Inquiry",
          phone: "",
          orderId: "",
          message: ""
        });
      } else {
        toast.error(data.error || "Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while sending your message.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pb-24 pt-6 sm:pt-10 overflow-hidden">
      {/* Ambient background glows */}
      <div className="fixed top-0 left-1/4 -z-10 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 -z-10 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="container-custom">
        {/* HERO SECTION */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto py-10 sm:py-16 px-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-xs sm:text-sm font-black tracking-wide mb-6">
            <Headphones className="w-4 h-4 animate-pulse" />
            <span>24/7 Dedicated Support Center</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight leading-[1.15] mb-6">
            Let's Start a <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-emerald-600 to-teal-500">Conversation</span>
          </h1>

          <p className="text-gray-600 text-base sm:text-lg leading-relaxed font-medium max-w-2xl mx-auto">
            Have a question about a product, custom rig quote, order tracking, or warranty support? Our expert tech team is ready to assist you.
          </p>
        </motion.div>

        {/* QUICK CONTACT CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-8 sm:my-12">
          {contactCards.map((card, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="bg-white border border-gray-100 p-6 rounded-3xl shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 border ${card.color}`}>
                  <card.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-gray-900 mb-1">{card.title}</h3>
                <p className="text-sm font-bold text-gray-800 mb-1">{card.details}</p>
                <p className="text-xs text-gray-500">{card.subDetails}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100">
                <a 
                  href={card.href} 
                  target={card.href.startsWith("http") ? "_blank" : "_self"}
                  rel="noopener noreferrer"
                  className="text-xs font-black text-primary hover:text-primary-dark flex items-center gap-1.5 group/link"
                >
                  <span>{card.actionText}</span>
                  <Send className="w-3 h-3 group-hover/link:translate-x-1 transition-transform" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* MAIN SECTION: FORM + STORE INFO */}
        <div className="my-12 sm:my-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* CONTACT FORM (Col-7) */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 bg-white border border-gray-100 rounded-3xl p-6 sm:p-10 shadow-sm relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-100">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">Send Us a Message</h2>
                <p className="text-xs sm:text-sm text-gray-500 mt-1 font-medium">Fill in the details below and we'll reply shortly.</p>
              </div>
              <div className="w-10 h-10 bg-primary/10 text-primary rounded-2xl flex items-center justify-center shrink-0">
                <MessageSquare className="w-5 h-5" />
              </div>
            </div>

            {submitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 text-center space-y-4"
              >
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-gray-900">Message Received!</h3>
                <p className="text-sm text-gray-600 max-w-md mx-auto">
                  Thank you for contacting TechStore. Our technical team has received your message and will get back to you within 2 hours.
                </p>
                <button 
                  onClick={() => setSubmitted(false)} 
                  className="mt-4 px-6 py-3 bg-primary text-white rounded-2xl font-black text-sm hover:bg-primary-dark transition-all"
                >
                  Send Another Message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-wider text-gray-700">
                      Your Name <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      placeholder="e.g. Tanvir Rahman"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-gray-50/80 border border-gray-200 rounded-2xl p-4 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all placeholder:text-gray-400"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-wider text-gray-700">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="email" 
                      placeholder="tanvir@example.com"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-gray-50/80 border border-gray-200 rounded-2xl p-4 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all placeholder:text-gray-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Topic Dropdown */}
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-wider text-gray-700">
                      Inquiry Topic
                    </label>
                    <select 
                      value={formData.topic}
                      onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                      className="w-full bg-gray-50/80 border border-gray-200 rounded-2xl p-4 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-gray-800"
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Order Status & Tracking">Order Status & Tracking</option>
                      <option value="Custom PC Build Quote">Custom PC Build Quote</option>
                      <option value="Warranty & Technical Support">Warranty & Technical Support</option>
                      <option value="Business & Corporate Order">Business & Corporate Order</option>
                    </select>
                  </div>

                  {/* Phone / Order ID */}
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-wider text-gray-700">
                      Order ID / Phone <span className="text-gray-400 font-normal">(Optional)</span>
                    </label>
                    <input 
                      type="text" 
                      placeholder="e.g. #ORD-9842 or 01700..."
                      value={formData.orderId}
                      onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
                      className="w-full bg-gray-50/80 border border-gray-200 rounded-2xl p-4 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all placeholder:text-gray-400"
                    />
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-gray-700">
                    Your Message <span className="text-red-500">*</span>
                  </label>
                  <textarea 
                    rows={5}
                    placeholder="How can our technical team help you today?"
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-gray-50/80 border border-gray-200 rounded-2xl p-4 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all placeholder:text-gray-400"
                  />
                </div>

                {/* Submit Button */}
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full py-4 bg-primary text-white rounded-2xl font-black text-sm hover:bg-primary-dark transition-all shadow-xl shadow-primary/25 hover:shadow-2xl active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Sending Message...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Message</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>

          {/* RIGHT COL: STORE HOURS & MAP CARD (Col-5) */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-5 space-y-6"
          >
            {/* Store Hours Card */}
            <div className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] text-white p-8 rounded-3xl shadow-xl border border-white/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-2xl" />
              
              <div className="relative z-10 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-bold text-primary">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Operating Hours</span>
                  </div>
                  <div className="w-3 h-3 bg-emerald-500 rounded-full animate-ping" />
                </div>

                <h3 className="text-xl font-black tracking-tight">Visit Our Flagship Hub</h3>

                <div className="space-y-3 text-xs sm:text-sm text-gray-300">
                  <div className="flex justify-between py-2 border-b border-white/10">
                    <span className="font-medium text-gray-400">Monday - Friday</span>
                    <span className="font-bold text-white">9:00 AM - 10:00 PM</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-white/10">
                    <span className="font-medium text-gray-400">Saturday & Sunday</span>
                    <span className="font-bold text-white">10:00 AM - 9:00 PM</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="font-medium text-gray-400">Online Support</span>
                    <span className="font-bold text-primary">24/7 Available</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center gap-3 text-xs text-gray-400">
                  <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
                  <span>Instant ticket confirmation generated upon submission.</span>
                </div>
              </div>
            </div>

            {/* Location Map Preview Card */}
            <div className="bg-white border border-gray-100 p-6 rounded-3xl shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-black text-gray-900 text-sm">TechStore Headquarters</h4>
                  <p className="text-xs text-gray-500">Dhanmondi 27, Dhaka 1209, Bangladesh</p>
                </div>
              </div>

              {/* Styled Map Container */}
              <div className="w-full h-48 bg-gray-100 rounded-2xl overflow-hidden border border-gray-200 relative group">
                <iframe 
                  title="TechStore Location Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.902442430132!2d90.375324!3d23.750885!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8b33cfffff1%3A0x8e833446059d09c!2sDhanmondi%2027!5e0!3m2!1sen!2sbd!4v1700000000000!5m2!1sen!2sbd" 
                  className="w-full h-full border-0 grayscale hover:grayscale-0 transition-all duration-500"
                  loading="lazy"
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* FAQ ACCORDION SECTION */}
        <div className="my-16 sm:my-24 max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full text-xs font-bold text-gray-600 uppercase tracking-widest mb-3">
              <HelpCircle className="w-4 h-4 text-primary" />
              <span>Got Questions?</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div 
                  key={idx}
                  className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm transition-all"
                >
                  <button 
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full p-6 text-left flex items-center justify-between gap-4 font-bold text-gray-900 hover:text-primary transition-colors"
                  >
                    <span className="text-sm sm:text-base">{faq.question}</span>
                    <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 shrink-0 ${isOpen ? "rotate-180 text-primary" : ""}`} />
                  </button>
                  
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="px-6 pb-6 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-50 pt-4">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
