"use client";

import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Award, 
  Users, 
  CheckCircle2, 
  ArrowRight, 
  Store, 
  Headphones, 
  Cpu, 
  Globe, 
  Target, 
  Rocket, 
  Heart,
  Github,
  Linkedin,
  Twitter
} from "lucide-react";

export default function AboutPage() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const stats = [
    { label: "Happy Customers", value: "50,000+", icon: Users, desc: "Satisfied tech enthusiasts worldwide" },
    { label: "Product Satisfaction", value: "99.8%", icon: ShieldCheck, desc: "Rigorous quality testing & genuine products" },
    { label: "Official Brand Partners", value: "120+", icon: Award, desc: "Direct partnerships with global tech giants" },
    { label: "Support Resolution", value: "24/7", icon: Headphones, desc: "Expert technical setup and care" },
  ];

  const coreValues = [
    {
      icon: ShieldCheck,
      title: "100% Authentic Guarantee",
      description: "We source directly from official brand manufacturers and authorized global distributors to guarantee genuine products every time.",
      badge: "Quality First",
      color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
    },
    {
      icon: Zap,
      title: "Lightning Express Delivery",
      description: "Equipped with automated fulfillment logistics, we ensure same-day dispatch and ultra-fast delivery straight to your doorstep.",
      badge: "Speed & Reliability",
      color: "bg-amber-500/10 text-amber-600 border-amber-500/20"
    },
    {
      icon: Cpu,
      title: "Cutting-Edge Innovation",
      description: "From custom enthusiast PC builds to next-gen AI gadgets, we curate the absolute latest tech breakthroughs as soon as they drop.",
      badge: "Next-Gen Hardware",
      color: "bg-blue-500/10 text-blue-600 border-blue-500/20"
    },
    {
      icon: Heart,
      title: "Customer-Centric Care",
      description: "Our relationship doesn't end at checkout. Enjoy hassle-free returns, official warranty coverage, and dedicated lifetime support.",
      badge: "24/7 Dedicated",
      color: "bg-rose-500/10 text-rose-600 border-rose-500/20"
    }
  ];

  const milestones = [
    {
      year: "2024",
      title: "TechStore Launch",
      description: "Founded with a vision to redefine e-commerce in Bangladesh by eliminating counterfeit products and delivering transparent pricing."
    },
    {
      year: "2025",
      title: "Brand Expansion & Hub",
      description: "Partnered with over 50 global tech leaders including ASUS, NVIDIA, Apple, and Intel; opened state-of-the-art tech experience hub."
    },
    {
      year: "2026",
      title: "AI PC Builder & Express Logistics",
      description: "Introduced instant custom PC compatibility algorithms, interactive gear comparison, and nationwide same-day shipping."
    }
  ];

  const team = [
    {
      name: "Amdad Islam",
      role: "Founder & Lead Architect",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
      bio: "Tech visionary passionate about high-performance computing, user experience, and next-gen retail technology.",
      socials: { github: "#", linkedin: "#", twitter: "#" }
    },
    {
      name: "Sarah Chen",
      role: "Head of Product Strategy",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80",
      bio: "Former hardware reviewer with 8+ years of experience curating premium gadget ecosystems and consumer tech.",
      socials: { github: "#", linkedin: "#", twitter: "#" }
    },
    {
      name: "Marcus Vance",
      role: "Lead Hardware Engineer",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
      bio: "Specialist in custom liquid-cooled rigs, thermal performance optimization, and workstation benchmark testing.",
      socials: { github: "#", linkedin: "#", twitter: "#" }
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 pb-24 pt-6 sm:pt-10 overflow-hidden">
      {/* Background Decorator Gradients */}
      <div className="fixed top-0 right-0 -z-10 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 left-0 -z-10 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="container-custom">
        {/* HERO SECTION */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto py-12 sm:py-16 px-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-xs sm:text-sm font-black tracking-wide mb-6">
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span>Pioneering Next-Gen Tech Retail</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight leading-[1.15] mb-6">
            Empowering Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-emerald-600 to-teal-500">Digital Evolution</span>
          </h1>

          <p className="text-gray-600 text-base sm:text-xl leading-relaxed font-medium mb-8 max-w-2xl mx-auto">
            TechStore bridges the gap between human creativity and revolutionary technology. We provide authentic hardware, custom enthusiast rigs, and seamless digital shopping.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/products" 
              className="w-full sm:w-auto px-8 py-4 bg-primary text-white rounded-2xl font-black text-sm hover:bg-primary-dark transition-all shadow-xl shadow-primary/25 hover:shadow-2xl hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 group"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="/contact" 
              className="w-full sm:w-auto px-8 py-4 bg-white text-gray-700 border border-gray-200 hover:border-primary/40 hover:text-primary rounded-2xl font-black text-sm transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2"
            >
              <span>Talk to an Expert</span>
            </Link>
          </div>
        </motion.div>

        {/* STATS SECTION */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-12"
        >
          {stats.map((stat, idx) => (
            <motion.div 
              key={idx}
              variants={itemVariants}
              className="bg-white/80 backdrop-blur-xl border border-gray-100 p-6 sm:p-8 rounded-3xl shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300 group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-125" />
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all">
                <stat.icon className="w-6 h-6" />
              </div>
              <h3 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight mb-1">
                {stat.value}
              </h3>
              <p className="text-sm font-bold text-gray-800 mb-2">{stat.label}</p>
              <p className="text-xs text-gray-500 leading-relaxed">{stat.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* OUR STORY / MISSION SECTION */}
        <div className="my-16 sm:my-24 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-xl text-gray-600 text-xs font-bold uppercase tracking-wider">
              <Store className="w-4 h-4 text-primary" />
              <span>Our Story & Mission</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tight leading-tight">
              Driven by Passion, Built for Performance.
            </h2>

            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              Founded in 2024, TechStore started with a clear observation: buying genuine high-performance computer hardware and gadgets was often confusing, slow, and plagued by market markup.
            </p>

            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              We set out to create a modern tech destination where authenticity is absolute, customer service is knowledgeable, and delivery is lightning fast. Whether you are building a custom gaming beast, upgrading your workstation, or looking for everyday audio gear, we treat every customer like an innovator.
            </p>

            <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                "100% Original Global Warranty",
                "Dedicated Tech Support Staff",
                "Instant Compatibility Check",
                "Flexible Payment & EMI Options"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-gray-800">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Visual Showcase Card */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6"
          >
            <div className="relative rounded-3xl bg-gradient-to-br from-[#0F172A] to-[#1E293B] p-8 text-white shadow-2xl overflow-hidden border border-white/10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
              
              <div className="relative z-10 space-y-6">
                <div className="w-14 h-14 bg-primary/20 rounded-2xl flex items-center justify-center text-primary border border-primary/30">
                  <Rocket className="w-7 h-7" />
                </div>
                
                <h3 className="text-2xl font-black tracking-tight text-white">
                  "Our goal is not just to sell products, but to inspire innovation in every workspace and setup."
                </h3>

                <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-white text-sm">TechStore Executive Team</h4>
                    <p className="text-xs text-gray-400">Dhaka Innovation Lab</p>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-xs font-bold text-primary">
                    <Globe className="w-3.5 h-3.5" />
                    <span>Global Standards</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* CORE VALUES GRID */}
        <div className="my-16 sm:my-24">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tight mb-4">
              What Sets Us Apart
            </h2>
            <p className="text-gray-600 text-sm sm:text-base font-medium">
              Built on four core pillars that guide every order, customer interaction, and product selection.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {coreValues.map((value, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="bg-white border border-gray-100 p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 hover:border-primary/20 group"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-800 group-hover:bg-primary group-hover:text-white transition-all">
                    <value.icon className="w-6 h-6" />
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-black border ${value.color}`}>
                    {value.badge}
                  </span>
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* GROWTH TIMELINE */}
        <div className="my-16 sm:my-24 bg-white border border-gray-100 rounded-3xl p-8 sm:p-12 shadow-sm">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-black text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full">Journey</span>
            <h2 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tight mt-3">
              Our Journey So Far
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {milestones.map((m, idx) => (
              <div key={idx} className="relative space-y-3 p-6 bg-gray-50/70 rounded-2xl border border-gray-100 hover:border-primary/30 transition-all">
                <span className="text-3xl font-black text-primary tracking-tighter">{m.year}</span>
                <h3 className="text-lg font-black text-gray-900">{m.title}</h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{m.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* TEAM SHOWCASE */}
        <div className="my-16 sm:my-24">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tight mb-3">
              Meet the People Behind TechStore
            </h2>
            <p className="text-gray-600 text-sm sm:text-base font-medium">
              Engineers, gamers, and tech architects committed to delivering excellence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="bg-white border border-gray-100 rounded-3xl p-6 text-center shadow-sm hover:shadow-xl transition-all duration-300 group"
              >
                <div className="relative w-28 h-28 mx-auto mb-6 rounded-full overflow-hidden ring-4 ring-primary/10 group-hover:ring-primary/40 transition-all">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  />
                </div>
                <h3 className="text-lg font-black text-gray-900">{member.name}</h3>
                <span className="inline-block text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full mt-1 mb-3">
                  {member.role}
                </span>
                <p className="text-xs text-gray-500 leading-relaxed mb-6">
                  {member.bio}
                </p>
                <div className="flex items-center justify-center gap-3 text-gray-400">
                  <a href={member.socials.github} className="hover:text-primary transition-colors p-2 hover:bg-gray-50 rounded-xl">
                    <Github className="w-4 h-4" />
                  </a>
                  <a href={member.socials.linkedin} className="hover:text-primary transition-colors p-2 hover:bg-gray-50 rounded-xl">
                    <Linkedin className="w-4 h-4" />
                  </a>
                  <a href={member.socials.twitter} className="hover:text-primary transition-colors p-2 hover:bg-gray-50 rounded-xl">
                    <Twitter className="w-4 h-4" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* BOTTOM CTA BANNER */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative rounded-3xl bg-[#0F172A] p-8 sm:p-14 text-center text-white overflow-hidden shadow-2xl border border-white/10"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              Ready to Upgrade Your Tech Ecosystem?
            </h2>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
              Explore thousands of genuine products, custom PC builder options, and exclusive deal offers today.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href="/products" 
                className="w-full sm:w-auto px-8 py-4 bg-primary text-white rounded-2xl font-black text-sm hover:bg-primary-dark transition-all shadow-xl shadow-primary/30 hover:scale-105 active:scale-95"
              >
                Browse All Products
              </Link>
              <Link 
                href="/contact" 
                className="w-full sm:w-auto px-8 py-4 bg-white/10 text-white hover:bg-white/20 rounded-2xl font-black text-sm transition-all border border-white/10"
              >
                Contact Customer Support
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
