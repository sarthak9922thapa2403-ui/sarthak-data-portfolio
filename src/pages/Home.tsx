import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { 
  FileSpreadsheet, 
  Database, 
  Zap, 
  ShieldCheck, 
  Clock,
  MessageSquare,
  Eye,
  ArrowRight,
  ChevronRight,
  Download,
  Mail,
  Phone,
  Send,
  CheckCircle
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import { 
  SERVICES, 
  HIGHLIGHTS, 
  MOCK_PROJECTS, 
  Project 
} from '../constants';
// import { FilePreview } from '../components/FilePreview';

import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

export const Home = () => {
  const navigate = useNavigate();
  const { settings } = useSettings();

  const heroRef = useRef(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const formData = new FormData(formRef.current);
      const response = await fetch('https://formsubmit.co/ajax/304c5da88b433bbed42f793870a9af52', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        setSubmitStatus('success');
        formRef.current?.reset();
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      console.error('FormSubmit Error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus('idle'), 5000);
    }
  };

  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'projects'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const fetchedProjects = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Project[];
        setProjects(fetchedProjects);
      } else {
        setProjects(MOCK_PROJECTS);
      }
    }, (error) => {
      console.error('Error fetching projects from Firebase:', error);
      setProjects(MOCK_PROJECTS);
    });

    const hash = window.location.hash;
    if (hash) {
      const id = hash.substring(1);
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }

    return () => unsubscribe();
  }, []);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const filteredProjects = projects.slice(0, 4);

  let parsedServices = SERVICES;
  try {
    if (settings.services) {
      const parsed = JSON.parse(settings.services);
      if (Array.isArray(parsed)) {
        parsedServices = parsed.map((s: any, i: number) => ({
          ...s,
          icon: SERVICES[i % SERVICES.length]?.icon || Database
        }));
      }
    }
  } catch (e) {}

  let parsedHighlights = HIGHLIGHTS;
  try {
    if (settings.highlights) {
      const parsed = JSON.parse(settings.highlights);
      if (Array.isArray(parsed)) {
        parsedHighlights = parsed.map((h: any, i: number) => ({
          title: h.title,
          icon: HIGHLIGHTS[i % HIGHLIGHTS.length]?.icon || CheckCircle
        }));
      }
    }
  } catch (e) {}

  return (
    <div className="relative min-h-screen">
      {/* Hero Section */}
      <section ref={heroRef} id="hero" className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          {settings.hero_image ? (
            <img
              src={settings.hero_image}
              alt="Hero Background"
              className="w-full h-full object-cover opacity-20"
              referrerPolicy="no-referrer"
            />
          ) : (
            <>
              <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[120px] animate-pulse" />
              <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary-accent/10 rounded-full blur-[120px] animate-pulse delay-700" />
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
            </>
          )}
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-bold tracking-wider uppercase mb-6 border border-accent/20">
                Data Processing Specialist
              </span>
              <div className="mb-8">
                <h1 className="text-6xl md:text-8xl font-bold tracking-tight leading-[0.9] mb-4 text-text-primary">
                  Sarthak Thapa
                </h1>
                <h2 className="text-4xl md:text-6xl font-semibold tracking-tight leading-[1.1] text-text-primary">
                  <span className="gradient-text pb-2">Transforming Raw Data</span><br />
                  into Structured Intelligence.
                </h2>
              </div>
              <p className="text-xl text-text-secondary max-w-2xl mb-10 leading-relaxed">
                Transforming raw, unstructured data into clean, accurate, and actionable insights. Expert in Excel, Google Sheets, and complex data conversions.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/portfolio"
                  className="px-10 py-4 bg-linear-to-r from-accent to-secondary-accent text-background font-bold rounded-2xl flex items-center justify-center gap-2 hover:scale-105 transition-transform shadow-lg shadow-accent/20 hover-glow"
                >
                  View My Work <ArrowRight className="w-5 h-5" />
                </Link>
                <Link 
                  to="/contact"
                  className="px-8 py-4 bg-accent text-background font-bold rounded-full flex items-center justify-center gap-2 transition-all hover-glow"
                >
                  Hire Me
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-32 bg-secondary-bg/30">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-8 gradient-text">About Me</h2>
              <p className="text-lg text-white mb-8 leading-relaxed">
                Detail-oriented Data Processing Specialist with expertise in Excel and Google Sheets, transforming raw, unstructured data into clean, organized, and analysis-ready formats. 
              </p>
              <p className="text-lg text-white mb-10 leading-relaxed">
                Skilled in data cleaning, formatting, and file conversions, I deliver accurate, efficient, and reliable data solutions. Focused on precision and clarity to support smarter decision-making.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {parsedHighlights.map((item) => (
                  <div 
                    key={item.title} 
                    className="flex items-center gap-4 p-4 glass-card hover:scale-105 hover:bg-accent/5 transition-all duration-300 cursor-default group"
                  >
                    <div className="p-2 bg-accent/10 rounded-lg group-hover:bg-accent group-hover:text-background transition-colors duration-300">
                      <item.icon className="w-6 h-6 text-accent group-hover:text-inherit" />
                    </div>
                    <span className="font-semibold group-hover:text-accent transition-colors duration-300">{item.title}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square rounded-3xl overflow-hidden border border-white/10 relative z-10">
                <img 
                  src="https://i.ibb.co/WvN1hsrB/1.jpg" 
                  alt="Sarthak Thapa" 
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -top-6 -right-6 w-full h-full border-2 border-accent rounded-3xl z-0" />
              <div className="absolute -bottom-10 -left-10 p-8 glass-card z-20 hidden lg:block hover:-translate-y-2 transition-transform duration-300 cursor-default group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Zap className="text-background" />
                  </div>
                  <div>
                    <p className="text-sm text-white/80 font-bold uppercase tracking-tighter group-hover:text-accent transition-colors duration-300">Efficiency</p>
                    <p className="text-xl font-bold">100% Focused</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-32">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">My Services</h2>
            <p className="text-white text-lg">
              Comprehensive data solutions tailored to your specific needs, ensuring accuracy and efficiency at every step.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {parsedServices.slice(0, 4).map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-8 glass-card group hover:bg-accent/5 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden"
              >
                {service.imageUrl && (
                  <div
                    className="absolute inset-0 z-0 bg-cover bg-center opacity-20 group-hover:opacity-40 transition-opacity duration-500"
                    style={{ backgroundImage: `url(${service.imageUrl})` }}
                  />
                )}
                <div className="relative z-10">
                  <div className="w-14 h-14 bg-secondary-bg rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-accent group-hover:text-background transition-all duration-500">
                    <service.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                  <p className="text-white/80 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link 
              to="/services" 
              className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-background font-bold rounded-full hover:bg-accent/90 transition-all hover:scale-105"
            >
              View All Services <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="py-32 bg-secondary-bg/30">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">Featured Projects</h2>
              <p className="text-white text-lg max-w-xl">
                A showcase of my expertise in data processing, cleaning, and complex conversions.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            <AnimatePresence mode="popLayout">
              {filteredProjects.length > 0 ? (
                filteredProjects.map((project) => (
                  <motion.div
                    layout
                    key={project.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="group relative glass-card overflow-hidden cursor-pointer"
                    onClick={() => navigate(`/project/${project.id}`)}
                  >
                    <div className="aspect-video overflow-hidden">
                      <img 
                        src={project.thumbnail} 
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="absolute inset-0 bg-linear-to-t from-background via-background/80 to-transparent opacity-100 transition-opacity" />
                    
                    <div className="absolute bottom-0 left-0 p-8 w-full">
                      <div className="flex gap-2 mb-4">
                        {project.tags.map(tag => (
                          <span key={tag} className="px-3 py-1 bg-accent/20 backdrop-blur-md text-accent text-[10px] font-bold uppercase tracking-widest rounded-full border border-accent/30 shadow-sm">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <h3 className="text-xl sm:text-xs md:text-5xl mb-6 line-clamp-2 font-bold group-hover:text-accent transition-colors drop-shadow-lg">{project.title}</h3>
                      <p className="hidden">{project.description}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm font-bold drop-shadow-md">
                          <Eye className="w-4 h-4" /> View Details
                        </div>
                        <div className="flex items-center gap-2 text-white/80 text-xs font-medium drop-shadow-md">
                          <FileSpreadsheet className="w-4 h-4" /> {project.files.length} Files
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full py-20 text-center glass-card"
                >
                  <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Clock className="w-10 h-10 text-accent" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Projects Coming Soon</h3>
                  <p className="text-white">I'm currently preparing some of my best work to showcase here. Stay tuned!</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {projects.length > 4 && (
            <div className="mt-16 text-center">
              <Link 
                to="/portfolio" 
                className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-background rounded-full font-bold hover:bg-accent/90 transition-all shadow-lg shadow-accent/20 group hover-glow"
              >
                View More Projects <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Me Section */}
      <section className="py-32 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <div className="absolute -top-20 -left-20 w-64 h-64 bg-accent/20 rounded-full blur-[100px]" />
              <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center gradient-text">Why Choose Me?</h2>
              
              <div className="space-y-8">
                {[
                  { title: "Accuracy-Focused", desc: "Meticulous attention to detail ensures your data is 100% correct and reliable.", icon: ShieldCheck },
                  { title: "Fast Delivery", desc: "Optimized workflows and expertise allow for rapid turnaround times without quality loss.", icon: Zap },
                  { title: "Clean Structured Data", desc: "I don't just process data; I organize it for maximum utility and insight generation.", icon: Database },
                ].map((item, i) => (
                  <motion.div 
                    key={item.title}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.2 }}
                    className="flex gap-6 p-6 glass-card hover:scale-105 hover:bg-accent/5 transition-all duration-300 cursor-default group"
                  >
                    <div className="shrink-0 w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center group-hover:bg-accent group-hover:text-background transition-colors duration-300">
                      <item.icon className="w-6 h-6 text-accent group-hover:text-inherit" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-2 group-hover:text-accent transition-colors duration-300">{item.title}</h4>
                      <p className="text-white leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-32 bg-secondary-bg/30">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">Contact Me</h2>
            <p className="text-white text-lg">
              For inquiries, collaborations, or project discussions, please don’t hesitate to get in touch. I look forward to working with you.
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-20">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="space-y-6">
                  <a href="https://mail.google.com/mail/?view=cm&fs=1&to=sarthak9922thapa2403@gmail.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-6 p-6 glass-card hover:bg-accent/5 transition-colors group relative overflow-hidden">
                    <div
                      className="absolute inset-0 z-0 bg-cover bg-center opacity-0 group-hover:opacity-30 transition-opacity duration-500"
                      style={{ backgroundImage: 'url(https://i.ibb.co/XxszV8TX/jk.png)' }}
                    />
                    <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center group-hover:bg-accent group-hover:text-background transition-all relative z-10">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div className="relative z-10">
                      <p className="text-xs text-white/80 font-bold uppercase tracking-widest mb-1">Email Me</p>
                      <p className="text-lg font-bold">sarthak9922thapa2403@gmail.com</p>
                    </div>
                  </a>

                  <a href="tel:+919368579922" className="flex items-center gap-6 p-6 glass-card hover:bg-accent/5 transition-colors group relative overflow-hidden">
                    <div
                      className="absolute inset-0 z-0 bg-cover bg-center opacity-0 group-hover:opacity-30 transition-opacity duration-500"
                      style={{ backgroundImage: 'url(https://i.ibb.co/JRG42ZJW/hjk.jpg)' }}
                    />
                    <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center group-hover:bg-accent group-hover:text-background transition-all relative z-10">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div className="relative z-10">
                      <p className="text-xs text-white/80 font-bold uppercase tracking-widest mb-1">Call Me</p>
                      <p className="text-lg font-bold">9368579922</p>
                    </div>
                  </a>

                  <a href="https://wa.me/919368579922" target="_blank" rel="noreferrer" className="flex items-center gap-6 p-6 glass-card hover:bg-accent/5 transition-colors group relative overflow-hidden">
                    <div
                      className="absolute inset-0 z-0 bg-cover bg-center opacity-0 group-hover:opacity-30 transition-opacity duration-500"
                      style={{ backgroundImage: 'url(https://i.ibb.co/qLh1SgYz/j.png)' }}
                    />
                    <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center group-hover:bg-accent group-hover:text-background transition-all relative z-10">
                      <MessageSquare className="w-6 h-6" />
                    </div>
                    <div className="relative z-10">
                      <p className="text-xs text-white/80 font-bold uppercase tracking-widest mb-1">WhatsApp</p>
                      <p className="text-lg font-bold">+91 9368579922</p>
                    </div>
                  </a>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="glass-card p-10 hover:border-accent/30 transition-all duration-300 relative overflow-hidden group"
              >
                <div 
                  className="absolute inset-0 z-0 bg-cover bg-center opacity-10 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none"
                  style={{ backgroundImage: 'url(https://i.ibb.co/KcZ2fg9Y/hjkl.jpg)' }}
                />
                <form ref={formRef} className="space-y-6 relative z-10" onSubmit={handleSubmit}>
                  {/* FormSubmit Configuration */}
                  <input type="hidden" name="_honey" style={{ display: 'none' }} />
                  <input type="hidden" name="_captcha" value="false" />
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-white/80 uppercase tracking-widest">Name</label>
                      <input 
                        type="text" 
                        name="user_name"
                        required
                        placeholder="Your Name"
                        className="w-full bg-background group-hover:bg-transparent border border-white/10 rounded-xl px-6 py-4 focus:outline-none focus:border-accent transition-all duration-300"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-white/80 uppercase tracking-widest">Email</label>
                      <input 
                        type="email" 
                        name="user_email"
                        required
                        placeholder="Your Email"
                        className="w-full bg-background group-hover:bg-transparent border border-white/10 rounded-xl px-6 py-4 focus:outline-none focus:border-accent transition-all duration-300"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-white/80 uppercase tracking-widest">Message</label>
                    <textarea 
                      name="message"
                      required
                      rows={5}
                      placeholder="Tell me about your project..."
                      className="w-full bg-background group-hover:bg-transparent border border-white/10 rounded-xl px-6 py-4 focus:outline-none focus:border-accent transition-all duration-300 resize-none"
                    />
                  </div>
                  <button 
                    disabled={isSubmitting}
                    className={`w-full py-5 bg-linear-to-r from-accent to-secondary-accent text-background font-bold rounded-2xl flex items-center justify-center gap-3 transition-all hover-glow ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'} <Send className="w-5 h-5" />
                  </button>

                  {submitStatus === 'success' && (
                    <motion.p 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-accent text-center font-bold"
                    >
                      Message sent successfully! I'll get back to you soon.
                    </motion.p>
                  )}
                  {submitStatus === 'error' && (
                    <motion.p 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-center font-bold"
                    >
                      Something went wrong. Please try again or contact me directly.
                    </motion.p>
                  )}
                </form>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* WhatsApp Quick Contact */}
      <a 
        href="https://wa.me/919368579922" 
        target="_blank" 
        rel="noreferrer"
        className="fixed bottom-8 right-8 z-40 w-16 h-16 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform hover-glow"
      >
        <MessageSquare className="w-8 h-8" />
      </a>
      </div>
  );
};
