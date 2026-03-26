import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MessageSquare, Send } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export const Contact = () => {
  const { settings } = useSettings();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

  return (
    <div className="pt-32 pb-20 overflow-hidden min-h-screen flex flex-col">
      <div className="container mx-auto px-6 flex-grow">
        <div className="max-w-3xl mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-bold tracking-wider uppercase mb-6 border border-accent/20">
              Get In Touch
            </span>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-8 leading-tight pb-2">
              Let's Work <span className="gradient-text py-1">Together</span>
            </h1>
            <p className="text-xl text-text-secondary leading-relaxed">
              Have a complex data project? Need a messy spreadsheet cleaned up? I'm here to help you turn your raw data into structured intelligence.
            </p>
          </motion.div>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="space-y-6">
                <a href={`https://mail.google.com/mail/?view=cm&fs=1&to=${settings.contact_email}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-6 p-6 glass-card hover:bg-accent/5 transition-colors group relative overflow-hidden">
                  <div
                    className="absolute inset-0 z-0 bg-cover bg-center opacity-0 group-hover:opacity-30 transition-opacity duration-500"
                    style={{ backgroundImage: 'url(https://i.ibb.co/XxszV8TX/jk.png)' }}
                  />
                  <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center group-hover:bg-accent group-hover:text-background transition-all relative z-10">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div className="relative z-10">
                    <p className="text-xs text-text-secondary font-bold uppercase tracking-widest mb-1">Email Me</p>
                    <p className="text-lg font-bold">{settings.contact_email}</p>
                  </div>
                </a>

                <a href={`tel:${settings.contact_phone.replace(/[^0-9+]/g, '')}`} className="flex items-center gap-6 p-6 glass-card hover:bg-accent/5 transition-colors group relative overflow-hidden">
                  <div
                    className="absolute inset-0 z-0 bg-cover bg-center opacity-0 group-hover:opacity-30 transition-opacity duration-500"
                    style={{ backgroundImage: 'url(https://i.ibb.co/JRG42ZJW/hjk.jpg)' }}
                  />
                  <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center group-hover:bg-accent group-hover:text-background transition-all relative z-10">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div className="relative z-10">
                    <p className="text-xs text-text-secondary font-bold uppercase tracking-widest mb-1">Call Me</p>
                    <p className="text-lg font-bold">{settings.contact_phone}</p>
                  </div>
                </a>

                <a href={`https://wa.me/${settings.contact_phone.replace(/[^0-9+]/g, '')}`} target="_blank" rel="noreferrer" className="flex items-center gap-6 p-6 glass-card hover:bg-accent/5 transition-colors group relative overflow-hidden">
                  <div
                    className="absolute inset-0 z-0 bg-cover bg-center opacity-0 group-hover:opacity-30 transition-opacity duration-500"
                    style={{ backgroundImage: 'url(https://i.ibb.co/qLh1SgYz/j.png)' }}
                  />
                  <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center group-hover:bg-accent group-hover:text-background transition-all relative z-10">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <div className="relative z-10">
                    <p className="text-xs text-text-secondary font-bold uppercase tracking-widest mb-1">WhatsApp</p>
                    <p className="text-lg font-bold">{settings.contact_phone}</p>
                  </div>
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
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
                    <label className="text-sm font-bold text-text-secondary uppercase tracking-widest">Name</label>
                    <input 
                      type="text" 
                      name="user_name"
                      required
                      placeholder="Your Name"
                      className="w-full bg-background group-hover:bg-transparent border border-white/10 rounded-xl px-6 py-4 focus:outline-none focus:border-accent transition-all duration-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-text-secondary uppercase tracking-widest">Email</label>
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
                  <label className="text-sm font-bold text-text-secondary uppercase tracking-widest">Message</label>
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
    </div>
  );
};
