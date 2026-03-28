import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  Download, 
  FileSpreadsheet, 
  FileText, 
  FileCode, 
  File as FileIcon,
  Image as ImageIcon,
  Video as VideoIcon,
  ExternalLink,
  Eye
} from 'lucide-react';
import { MOCK_PROJECTS, Project, ProjectFile } from '../constants';
import { useSettings } from '../context/SettingsContext';

import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

export const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { settings } = useSettings();
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [isEmbedLoaded, setIsEmbedLoaded] = useState(false);
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsEmbedLoaded(false);
  }, [currentFileIndex, id]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchProject = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'projects', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setProject({ id: docSnap.id, ...docSnap.data() } as Project);
        } else {
          if (!settings.projectsSeeded) {
            const mock = MOCK_PROJECTS.find(p => p.id === id);
            setProject(mock || null);
          } else {
            setProject(null);
          }
        }
      } catch (err) {
        console.error('Failed to fetch project', err);
        if (!settings.projectsSeeded) {
          const mock = MOCK_PROJECTS.find(p => p.id === id);
          setProject(mock || null);
        } else {
          setProject(null);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchProject();
  }, [id, settings.projectsSeeded]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-20">
        <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
        <p className="text-text-secondary mb-8">The project you are looking for does not exist.</p>
        <button 
          onClick={() => navigate(-1)}
          className="px-6 py-3 bg-accent text-background font-bold rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2 hover-glow"
        >
          <ArrowLeft className="w-5 h-5" /> Go Back
        </button>
      </div>
    );
  }

  const currentFile = project.files[currentFileIndex];

  const getFileIcon = (type: ProjectFile['type']) => {
    switch (type) {
      case 'excel': return <FileSpreadsheet className="w-6 h-6 text-accent" />;
      case 'word': return <FileCode className="w-6 h-6 text-secondary-accent" />;
      case 'pdf': return <FileText className="w-6 h-6 text-red-400" />;
      case 'image': return <ImageIcon className="w-6 h-6 text-purple-400" />;
      case 'video': return <VideoIcon className="w-6 h-6 text-blue-400" />;
      default: return <FileIcon className="w-6 h-6 text-text-secondary" />;
    }
  };

  const renderPreview = () => {
    if (currentFile.type === 'image') {
      return (
        <img 
          src={currentFile.url.startsWith('#') ? project.thumbnail : currentFile.url} 
          alt={currentFile.name}
          className="max-h-full max-w-full object-contain rounded-lg shadow-2xl"
          referrerPolicy="no-referrer"
        />
      );
    }

    if (currentFile.type === 'pdf' || currentFile.type === 'excel' || currentFile.type === 'word') {
      if (currentFile.url && currentFile.url !== '#') {
        return (
          <div className="w-full h-full flex flex-col gap-4">
            <div className="flex-1 bg-white rounded-lg overflow-hidden border border-white/10 shadow-2xl min-h-[500px] relative">
              {!isEmbedLoaded ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-secondary-bg p-8 text-center z-10">
                  <div className="p-4 bg-background rounded-2xl mb-6">
                    {getFileIcon(currentFile.type)}
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{currentFile.name}</h3>
                  <p className="text-text-secondary max-w-md mb-8 leading-relaxed">
                    Interactive previews for {currentFile.type.toUpperCase()} files can be memory-intensive and may cause the browser to slow down or crash. Click below to load the preview, or open it directly in a new tab for the best experience.
                  </p>
                  <button
                    onClick={() => setIsEmbedLoaded(true)}
                    className="px-6 py-3 bg-accent/20 text-accent font-bold rounded-xl hover:bg-accent/30 transition-colors flex items-center gap-2"
                  >
                    <Eye className="w-5 h-5" /> Load Interactive Preview
                  </button>
                </div>
              ) : (
                <iframe 
                  src={currentFile.url} 
                  className="w-full h-full border-none"
                  title={currentFile.name}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                />
              )}
            </div>
            <a 
              href={currentFile.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-6 py-3 bg-accent text-background font-bold rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 hover-glow"
            >
              <ExternalLink className="w-5 h-5" /> Open in New Tab
            </a>
          </div>
        );
      }

      return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-secondary-bg rounded-lg border border-white/10 shadow-2xl p-8 text-center">
          <div className="p-4 bg-background rounded-2xl mb-6">
            {getFileIcon(currentFile.type)}
          </div>
          <h3 className="text-2xl font-bold mb-4">{currentFile.name}</h3>
          <p className="text-text-secondary max-w-md mb-8 leading-relaxed">
            {currentFile.type === 'pdf' 
              ? 'PDF Document Preview' 
              : `This ${currentFile.type} file contains complex formulas, formatting, and data structures that are best viewed in their native application.`}
          </p>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-center h-full text-text-secondary bg-secondary-bg rounded-lg border border-white/10">
        Preview not available for this file type.
      </div>
    );
  };

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-6">
        
        {/* Back Button & Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-text-secondary hover:text-accent transition-colors mb-8 font-medium hover-glow"
          >
            <ArrowLeft className="w-5 h-5" /> Back to Portfolio
          </button>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-3xl">
              <div className="flex flex-wrap gap-2 mb-6">
                {project.tags.map(tag => (
                  <span key={tag} className="px-4 py-1.5 bg-accent/10 text-accent text-xs font-bold uppercase tracking-widest rounded-full border border-accent/20">
                    {tag}
                  </span>
                ))}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">{project.title}</h1>
              <p className="text-xl text-text-secondary leading-relaxed">
                {project.description}
              </p>
            </div>
          </div>
        </motion.div>

        {/* File Viewer Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid lg:grid-cols-4 gap-8 h-[800px]"
        >
          {/* Sidebar - File List */}
          <div className="lg:col-span-1 flex flex-col gap-4">
            <h3 className="text-lg font-bold mb-2 px-2">Project Files ({project.files.length})</h3>
            <div className="flex flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar">
              {project.files.map((file, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentFileIndex(index)}
                  className={`flex items-center gap-4 p-4 rounded-2xl text-left transition-all hover-glow ${
                    index === currentFileIndex 
                      ? 'bg-accent/10 border border-accent/30 shadow-[0_0_15px_rgba(0,200,150,0.1)]' 
                      : 'bg-secondary-bg border border-white/5 hover:bg-white/5 hover:border-white/10'
                  }`}
                >
                  <div className={`shrink-0 p-2 rounded-lg ${index === currentFileIndex ? 'bg-background' : 'bg-background/50'}`}>
                    {getFileIcon(file.type)}
                  </div>
                  <div className="overflow-hidden">
                    <span className={`block text-sm font-bold truncate ${index === currentFileIndex ? 'text-accent' : 'text-text-primary'}`}>
                      {file.name}
                    </span>
                    <span className="text-xs text-text-secondary mt-1 block">
                      {file.size || 'Unknown size'} • {file.type.toUpperCase()}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Main Preview Area */}
          <div className="lg:col-span-3 bg-secondary-bg/30 rounded-3xl border border-white/10 p-4 md:p-8 relative overflow-hidden h-full min-h-[500px]">
            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary-accent/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />
            
            <div className="relative z-10 w-full h-full">
              {renderPreview()}
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
};
