import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  FileSpreadsheet, 
  Database, 
  FileText, 
  FileCode, 
  CheckCircle2, 
  Zap, 
  ShieldCheck, 
  Clock,
  ArrowRight,
  ChevronRight
} from 'lucide-react';
import { SERVICES } from '../constants';
import { Link } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';

export const Services = () => {
  const { settings } = useSettings();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

  const detailedServices = parsedServices.map((service: any, index: number) => {
    const colors = [
      "from-emerald-500 to-teal-500",
      "from-blue-500 to-indigo-500",
      "from-purple-500 to-pink-500",
      "from-orange-500 to-red-500",
      "from-cyan-500 to-blue-500",
      "from-yellow-500 to-orange-500"
    ];
    return {
      ...service,
      features: service.features || [],
      color: colors[index % colors.length]
    };
  });

  return (
    <div className="pt-32 pb-20 overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="max-w-3xl mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-bold tracking-wider uppercase mb-6 border border-accent/20">
              Our Expertise
            </span>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">
              Professional <span className="gradient-text">Data Services</span>
            </h1>
            <p className="text-xl text-text-secondary leading-relaxed">
              From simple spreadsheet fixes to complex data automation, I provide end-to-end data processing solutions that save you time and ensure 100% accuracy.
            </p>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {detailedServices.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="glass-card p-10 group hover:bg-white/5 transition-all duration-500 relative overflow-hidden"
            >
              {service.imageUrl && (
                <div
                  className="absolute inset-0 z-0 bg-cover bg-center opacity-0 group-hover:opacity-30 transition-opacity duration-500"
                  style={{ backgroundImage: `url(${service.imageUrl})` }}
                />
              )}
              <div className="relative z-10 flex flex-col md:flex-row gap-8">
                <div className={`shrink-0 w-20 h-20 bg-linear-to-br ${service.color} rounded-3xl flex items-center justify-center text-background shadow-lg shadow-black/20 group-hover:scale-110 transition-transform duration-500`}>
                  <service.icon className="w-10 h-10" />
                </div>
                
                <div className="flex-grow">
                  <h3 className="text-3xl font-bold mb-4 group-hover:text-accent transition-colors">{service.title}</h3>
                  <p className="text-text-secondary text-lg mb-8 leading-relaxed">
                    {service.description}
                  </p>
                  
                  {service.features && service.features.length > 0 && (
                    <div className="grid sm:grid-cols-2 gap-4">
                      {service.features.map((feature) => (
                        <div key={feature} className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                          <span className="text-sm text-text-primary/80">{feature}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative p-12 md:p-20 rounded-[40px] overflow-hidden text-center mt-32"
        >
          <div className="absolute inset-0 bg-linear-to-r from-accent/20 to-secondary-accent/20 backdrop-blur-3xl" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5" />
          
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-bold mb-8">Portfolio Overview</h2>
            <p className="text-xl text-text-secondary mb-12">
              Feel free to take a look at my portfolio to explore my work. I’d be glad to help bring the same quality and accuracy to your project.
            </p>
            <div className="flex justify-center">
              <Link 
                to="/portfolio"
                className="px-12 py-5 glass-card font-bold hover:bg-white/10 transition-colors flex items-center justify-center gap-3 hover-glow"
              >
                View Portfolio
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

