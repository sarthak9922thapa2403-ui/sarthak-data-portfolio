import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileSpreadsheet, 
  Eye, 
  Clock,
  Search,
  ArrowRight
} from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import { 
  MOCK_PROJECTS, 
  Project 
} from '../constants';

import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '../firebase';

export const Portfolio = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState(() => {
    const params = new URLSearchParams(location.search);
    return params.get('service') || '';
  });
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const service = params.get('service');
    if (service) {
      setSearchQuery(service);
    }
  }, [location.search]);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const q = query(collection(db, 'projects'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const fetchedProjects = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Project[];
        setProjects(fetchedProjects);
        setIsLoading(false);
      } else {
        setProjects(MOCK_PROJECTS);
        setIsLoading(false);
      }
    }, (error) => {
      console.error('Error fetching projects from Firebase:', error);
      setProjects(MOCK_PROJECTS);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesSearch;
  });

  return (
    <div className="pt-32 pb-20">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-bold tracking-wider uppercase mb-6 border border-accent/20">
              Portfolio
            </span>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">
              My <span className="gradient-text">Work Archive</span>
            </h1>
            <p className="text-xl text-text-secondary leading-relaxed">
              Explore a comprehensive collection of data processing projects, from complex Excel automation to large-scale data cleaning and conversions.
            </p>
          </motion.div>
        </div>

        {/* Search */}
        <div className="flex justify-end mb-12">
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
            <input 
              type="text"
              placeholder="Search projects or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-background border border-white/10 rounded-xl pl-12 pr-6 py-3 focus:outline-none focus:border-accent transition-colors glass-card"
            />
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project, index) => (
                <motion.div
                  layout
                  key={project.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  className="group relative glass-card overflow-hidden cursor-pointer flex flex-col h-full"
                  onClick={() => navigate(`/project/${project.id}`)}
                >
                  <div className="aspect-video overflow-hidden relative">
                    <img 
                      src={project.thumbnail} 
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-background/20 group-hover:bg-background/0 transition-colors duration-500" />
                  </div>
                  
                  <div className="p-8 flex flex-col flex-grow">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags.map(tag => (
                        <span key={tag} className="px-2.5 py-0.5 bg-accent/10 text-accent text-[10px] font-bold uppercase tracking-widest rounded-md border border-accent/20">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-2xl font-bold mb-3 group-hover:text-accent transition-colors">{project.title}</h3>
                    <p className="text-text-secondary line-clamp-3 mb-8 flex-grow">{project.description}</p>
                    
                    <div className="flex items-center justify-between pt-6 border-t border-white/5">
                      <div className="flex items-center gap-2 text-sm font-bold text-accent">
                        <Eye className="w-4 h-4" /> View Details
                      </div>
                      <div className="flex items-center gap-2 text-text-secondary text-xs">
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
                className="col-span-full py-32 text-center glass-card"
              >
                <div className="w-24 h-24 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-8">
                  {searchQuery ? <Search className="w-10 h-10 text-accent" /> : <Clock className="w-10 h-10 text-accent" />}
                </div>
                <h3 className="text-3xl font-bold mb-4">
                  {searchQuery ? 'No matching projects found' : 'More Projects Coming Soon'}
                </h3>
                <p className="text-text-secondary text-lg max-w-md mx-auto">
                  {searchQuery 
                    ? `We couldn't find any projects matching "${searchQuery}". Try a different search term.` 
                    : "I'm currently documenting more of my past work. Check back soon for new additions!"}
                </p>
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="mt-8 px-8 py-3 bg-accent text-background font-bold rounded-xl hover:shadow-lg transition-all hover-glow"
                  >
                    Clear Search
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
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
            <h2 className="text-4xl md:text-6xl font-bold mb-8">Ready to Clean Up Your Data?</h2>
            <p className="text-xl text-text-secondary mb-12">
              Stop struggling with messy spreadsheets. Let me handle the heavy lifting so you can focus on what matters most.
            </p>
            <div className="flex justify-center">
              <Link 
                to="/contact"
                className="px-12 py-5 bg-accent text-background font-bold rounded-2xl transition-all flex items-center justify-center gap-3 hover-glow"
              >
                Hire Me <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
