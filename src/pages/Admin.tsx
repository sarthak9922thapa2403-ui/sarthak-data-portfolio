import React, { useState, useEffect } from 'react';
import { Project, ProjectFile, SERVICES, HIGHLIGHTS, STATS } from '../constants';
import { Plus, Edit, Trash2, LogOut, Save, X, Settings as SettingsIcon, LayoutDashboard, Layers, Star, BarChart, Tag } from 'lucide-react';
import { motion } from 'motion/react';

export function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'projects' | 'services' | 'highlights' | 'stats' | 'tags' | 'settings'>('projects');
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [editingService, setEditingService] = useState<{title: string, description: string, imageUrl?: string, index: number} | null>(null);
  const [editingHighlight, setEditingHighlight] = useState<{title: string, index: number} | null>(null);
  const [editingStat, setEditingStat] = useState<{label: string, value: string, index: number} | null>(null);
  const [editingTag, setEditingTag] = useState<{name: string, index: number} | null>(null);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{text: string, type: 'success' | 'error'} | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{type: 'project' | 'service' | 'highlight' | 'stat', id: string | number} | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      setIsAuthenticated(true);
      fetchProjects();
      fetchSettings();
    }
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects');
      const data = await res.json();
      setProjects(data);
    } catch (err) {
      console.error('Failed to fetch projects', err);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      setSettings(data);
    } catch (err) {
      console.error('Failed to fetch settings', err);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('adminToken', 'Bearer ' + data.token);
        setIsAuthenticated(true);
        fetchProjects();
        fetchSettings();
      } else {
        setError('Invalid password');
      }
    } catch (err) {
      setError('Login failed');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
  };

  const handleDelete = (id: string) => {
    setDeleteConfirm({ type: 'project', id });
  };

  const executeDeleteProject = async (id: string) => {
    try {
      await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': localStorage.getItem('adminToken') || '' }
      });
      fetchProjects();
    } catch (err) {
      console.error('Failed to delete', err);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    try {
      const method = isAdding ? 'POST' : 'PUT';
      const url = isAdding ? '/api/projects' : `/api/projects/${editingProject.id}`;
      
      await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('adminToken') || ''
        },
        body: JSON.stringify(editingProject)
      });
      
      setEditingProject(null);
      setIsAdding(false);
      fetchProjects();
    } catch (err) {
      console.error('Failed to save', err);
    }
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;

    let currentServices: any[] = [];
    try { 
      if (settings.services) {
        currentServices = JSON.parse(settings.services);
      } else {
        currentServices = SERVICES.map(s => ({ title: s.title, description: s.description }));
      }
    } catch (e) {}

    if (editingService.index === -1) {
      currentServices.push({ title: editingService.title, description: editingService.description, imageUrl: editingService.imageUrl });
    } else {
      currentServices[editingService.index] = { title: editingService.title, description: editingService.description, imageUrl: editingService.imageUrl };
    }

    const newSettings = { ...settings, services: JSON.stringify(currentServices) };
    setSettings(newSettings);

    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('adminToken') || ''
        },
        body: JSON.stringify({ services: JSON.stringify(currentServices) })
      });
      setEditingService(null);
    } catch (err) {
      console.error('Failed to save service', err);
    }
  };

  const handleDeleteService = (index: number) => {
    setDeleteConfirm({ type: 'service', id: index });
  };

  const executeDeleteService = async (index: number) => {
    let currentServices: any[] = [];
    try { 
      if (settings.services) {
        currentServices = JSON.parse(settings.services);
      } else {
        currentServices = SERVICES.map(s => ({ title: s.title, description: s.description }));
      }
    } catch (e) {}

    currentServices.splice(index, 1);
    const newSettings = { ...settings, services: JSON.stringify(currentServices) };
    setSettings(newSettings);

    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('adminToken') || ''
        },
        body: JSON.stringify({ services: JSON.stringify(currentServices) })
      });
    } catch (err) {
      console.error('Failed to delete service', err);
    }
  };

  const handleSaveHighlight = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingHighlight) return;

    let currentHighlights: any[] = [];
    try { 
      if (settings.highlights) {
        currentHighlights = JSON.parse(settings.highlights);
      } else {
        currentHighlights = HIGHLIGHTS.map(h => ({ title: h.title }));
      }
    } catch (e) {}

    if (editingHighlight.index === -1) {
      currentHighlights.push({ title: editingHighlight.title });
    } else {
      currentHighlights[editingHighlight.index] = { title: editingHighlight.title };
    }

    const newSettings = { ...settings, highlights: JSON.stringify(currentHighlights) };
    setSettings(newSettings);

    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('adminToken') || ''
        },
        body: JSON.stringify({ highlights: JSON.stringify(currentHighlights) })
      });
      setEditingHighlight(null);
    } catch (err) {
      console.error('Failed to save highlight', err);
    }
  };

  const handleDeleteHighlight = (index: number) => {
    setDeleteConfirm({ type: 'highlight', id: index });
  };

  const executeDeleteHighlight = async (index: number) => {
    let currentHighlights: any[] = [];
    try { 
      if (settings.highlights) {
        currentHighlights = JSON.parse(settings.highlights);
      } else {
        currentHighlights = HIGHLIGHTS.map(h => ({ title: h.title }));
      }
    } catch (e) {}

    currentHighlights.splice(index, 1);
    const newSettings = { ...settings, highlights: JSON.stringify(currentHighlights) };
    setSettings(newSettings);

    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('adminToken') || ''
        },
        body: JSON.stringify({ highlights: JSON.stringify(currentHighlights) })
      });
    } catch (err) {
      console.error('Failed to delete highlight', err);
    }
  };

  const handleSaveStat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStat) return;

    let currentStats: any[] = [];
    try { 
      if (settings.stats) {
        currentStats = JSON.parse(settings.stats);
      } else {
        currentStats = STATS.map(s => ({ label: s.label, value: s.value }));
      }
    } catch (e) {}

    if (editingStat.index === -1) {
      currentStats.push({ label: editingStat.label, value: editingStat.value });
    } else {
      currentStats[editingStat.index] = { label: editingStat.label, value: editingStat.value };
    }

    const newSettings = { ...settings, stats: JSON.stringify(currentStats) };
    setSettings(newSettings);

    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('adminToken') || ''
        },
        body: JSON.stringify({ stats: JSON.stringify(currentStats) })
      });
      setEditingStat(null);
    } catch (err) {
      console.error('Failed to save stat', err);
    }
  };

  const handleDeleteStat = (index: number) => {
    setDeleteConfirm({ type: 'stat', id: index });
  };

  const executeDeleteStat = async (index: number) => {
    let currentStats: any[] = [];
    try { 
      if (settings.stats) {
        currentStats = JSON.parse(settings.stats);
      } else {
        currentStats = STATS.map(s => ({ label: s.label, value: s.value }));
      }
    } catch (e) {}

    currentStats.splice(index, 1);
    const newSettings = { ...settings, stats: JSON.stringify(currentStats) };
    setSettings(newSettings);

    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('adminToken') || ''
        },
        body: JSON.stringify({ stats: JSON.stringify(currentStats) })
      });
    } catch (err) {
      console.error('Failed to delete stat', err);
    }
  };

  const handleSaveTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTag) return;

    let currentTags: any[] = [];
    try { 
      if (settings.project_tags) {
        currentTags = JSON.parse(settings.project_tags);
      }
    } catch (e) {}

    if (editingTag.index === -1) {
      currentTags.push({ name: editingTag.name });
    } else {
      currentTags[editingTag.index] = { name: editingTag.name };
    }

    const newSettings = { ...settings, project_tags: JSON.stringify(currentTags) };
    setSettings(newSettings);

    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('adminToken') || ''
        },
        body: JSON.stringify({ project_tags: JSON.stringify(currentTags) })
      });
      setEditingTag(null);
    } catch (err) {
      console.error('Failed to save tag', err);
    }
  };

  const handleDeleteTag = (index: number) => {
    setDeleteConfirm({ type: 'tag', id: index });
  };

  const executeDeleteTag = async (index: number) => {
    let currentTags: any[] = [];
    try { 
      if (settings.project_tags) {
        currentTags = JSON.parse(settings.project_tags);
      }
    } catch (e) {}

    currentTags.splice(index, 1);
    const newSettings = { ...settings, project_tags: JSON.stringify(currentTags) };
    setSettings(newSettings);

    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('adminToken') || ''
        },
        body: JSON.stringify({ project_tags: JSON.stringify(currentTags) })
      });
    } catch (err) {
      console.error('Failed to delete tag', err);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('adminToken') || ''
        },
        body: JSON.stringify(settings)
      });
      setSaveMessage({ text: 'Settings saved successfully!', type: 'success' });
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (err) {
      console.error('Failed to save settings', err);
      setSaveMessage({ text: 'Failed to save settings', type: 'error' });
      setTimeout(() => setSaveMessage(null), 3000);
    } finally {
      setIsSavingSettings(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 w-full max-w-md"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-background/50 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
                required
              />
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button type="submit" className="w-full bg-accent text-background font-medium py-2 rounded-lg hover:bg-accent/90 transition-colors">
              Login
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  if (editingService) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">{editingService.index === -1 ? 'Add Service' : 'Edit Service'}</h1>
          <button onClick={() => setEditingService(null)} className="p-2 hover:bg-white/5 rounded-full">
            <X className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSaveService} className="glass-card p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Title</label>
            <input
              type="text"
              value={editingService.title}
              onChange={(e) => setEditingService({...editingService, title: e.target.value})}
              className="w-full bg-background/50 border border-white/10 rounded-lg px-4 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Description</label>
            <textarea
              value={editingService.description}
              onChange={(e) => setEditingService({...editingService, description: e.target.value})}
              className="w-full bg-background/50 border border-white/10 rounded-lg px-4 py-2 h-32"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Image URL (for hover background)</label>
            <input
              type="url"
              value={editingService.imageUrl || ''}
              onChange={(e) => setEditingService({...editingService, imageUrl: e.target.value})}
              className="w-full bg-background/50 border border-white/10 rounded-lg px-4 py-2"
            />
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={() => setEditingService(null)} className="px-6 py-2 rounded-lg hover:bg-white/5">
              Cancel
            </button>
            <button type="submit" className="px-6 py-2 bg-accent text-background font-medium rounded-lg hover:bg-accent/90 flex items-center gap-2">
              <Save className="w-4 h-4" /> Save Service
            </button>
          </div>
        </form>
      </div>
    );
  }

  if (editingHighlight) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">{editingHighlight.index === -1 ? 'Add Highlight' : 'Edit Highlight'}</h1>
          <button onClick={() => setEditingHighlight(null)} className="p-2 hover:bg-white/5 rounded-full">
            <X className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSaveHighlight} className="glass-card p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Title</label>
            <input
              type="text"
              value={editingHighlight.title}
              onChange={(e) => setEditingHighlight({...editingHighlight, title: e.target.value})}
              className="w-full bg-background/50 border border-white/10 rounded-lg px-4 py-2"
              required
            />
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={() => setEditingHighlight(null)} className="px-6 py-2 rounded-lg hover:bg-white/5">
              Cancel
            </button>
            <button type="submit" className="px-6 py-2 bg-accent text-background font-medium rounded-lg hover:bg-accent/90 flex items-center gap-2">
              <Save className="w-4 h-4" /> Save Highlight
            </button>
          </div>
        </form>
      </div>
    );
  }

  if (editingStat) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">{editingStat.index === -1 ? 'Add Stat' : 'Edit Stat'}</h1>
          <button onClick={() => setEditingStat(null)} className="p-2 hover:bg-white/5 rounded-full">
            <X className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSaveStat} className="glass-card p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Label</label>
              <input
                type="text"
                value={editingStat.label}
                onChange={(e) => setEditingStat({...editingStat, label: e.target.value})}
                className="w-full bg-background/50 border border-white/10 rounded-lg px-4 py-2"
                placeholder="e.g. Projects Completed"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Value</label>
              <input
                type="text"
                value={editingStat.value}
                onChange={(e) => setEditingStat({...editingStat, value: e.target.value})}
                className="w-full bg-background/50 border border-white/10 rounded-lg px-4 py-2"
                placeholder="e.g. 250+"
                required
              />
            </div>
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={() => setEditingStat(null)} className="px-6 py-2 rounded-lg hover:bg-white/5">
              Cancel
            </button>
            <button type="submit" className="px-6 py-2 bg-accent text-background font-medium rounded-lg hover:bg-accent/90 flex items-center gap-2">
              <Save className="w-4 h-4" /> Save Stat
            </button>
          </div>
        </form>
      </div>
    );
  }

  if (editingTag) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">{editingTag.index === -1 ? 'Add Tag' : 'Edit Tag'}</h1>
          <button onClick={() => setEditingTag(null)} className="p-2 hover:bg-white/5 rounded-full">
            <X className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSaveTag} className="glass-card p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Tag Name</label>
            <input
              type="text"
              value={editingTag.name}
              onChange={(e) => setEditingTag({...editingTag, name: e.target.value})}
              className="w-full bg-background/50 border border-white/10 rounded-lg px-4 py-2"
              placeholder="e.g. Excel"
              required
            />
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={() => setEditingTag(null)} className="px-6 py-2 rounded-lg hover:bg-white/5">
              Cancel
            </button>
            <button type="submit" className="px-6 py-2 bg-accent text-background font-medium rounded-lg hover:bg-accent/90 flex items-center gap-2">
              <Save className="w-4 h-4" /> Save Tag
            </button>
          </div>
        </form>
      </div>
    );
  }

  if (editingProject) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">{isAdding ? 'Add Project' : 'Edit Project'}</h1>
          <button onClick={() => { setEditingProject(null); setIsAdding(false); }} className="p-2 hover:bg-white/5 rounded-full">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSave} className="glass-card p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">ID (Unique)</label>
              <input
                type="text"
                value={editingProject.id}
                onChange={(e) => setEditingProject({...editingProject, id: e.target.value})}
                disabled={!isAdding}
                className="w-full bg-background/50 border border-white/10 rounded-lg px-4 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Title</label>
              <input
                type="text"
                value={editingProject.title}
                onChange={(e) => setEditingProject({...editingProject, title: e.target.value})}
                className="w-full bg-background/50 border border-white/10 rounded-lg px-4 py-2"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-muted-foreground mb-1">Description</label>
              <textarea
                value={editingProject.description}
                onChange={(e) => setEditingProject({...editingProject, description: e.target.value})}
                className="w-full bg-background/50 border border-white/10 rounded-lg px-4 py-2 h-32"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Category</label>
              <select
                value={editingProject.category}
                onChange={(e) => setEditingProject({...editingProject, category: e.target.value as any})}
                className="w-full bg-background/50 border border-white/10 rounded-lg px-4 py-2 text-white"
              >
                <option value="Excel">Excel</option>
                <option value="Data Cleaning">Data Cleaning</option>
                <option value="Conversions">Conversions</option>
                <option value="Data Extraction">Data Extraction</option>
                <option value="Data Processing">Data Processing</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Thumbnail URL</label>
              <input
                type="text"
                value={editingProject.thumbnail}
                onChange={(e) => setEditingProject({...editingProject, thumbnail: e.target.value})}
                className="w-full bg-background/50 border border-white/10 rounded-lg px-4 py-2"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-muted-foreground mb-1">Tags</label>
              <div className="flex flex-wrap gap-2">
                {(() => {
                  let tagsList: any[] = [];
                  try { 
                    if (settings.project_tags) {
                      tagsList = JSON.parse(settings.project_tags);
                    }
                  } catch (e) {}
                  return tagsList.map((tag, index) => (
                    <label key={index} className="flex items-center gap-2 bg-background/50 border border-white/10 rounded-lg px-3 py-1 cursor-pointer hover:bg-white/5">
                      <input
                        type="checkbox"
                        checked={editingProject.tags.includes(tag.name)}
                        onChange={(e) => {
                          const newTags = e.target.checked
                            ? [...editingProject.tags, tag.name]
                            : editingProject.tags.filter(t => t !== tag.name);
                          setEditingProject({...editingProject, tags: newTags});
                        }}
                        className="rounded border-white/10 bg-background/50"
                      />
                      {tag.name}
                    </label>
                  ));
                })()}
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Files</h3>
              <button 
                type="button"
                onClick={() => setEditingProject({
                  ...editingProject, 
                  files: [...editingProject.files, { name: '', type: 'excel', url: '', size: 'Live Embed' }]
                })}
                className="text-sm bg-white/10 px-3 py-1 rounded-lg hover:bg-white/20"
              >
                Add File
              </button>
            </div>
            
            <div className="space-y-4">
              {editingProject.files.map((file, index) => (
                <div key={index} className="flex gap-4 items-start bg-black/20 p-4 rounded-lg">
                  <div className="flex-1 space-y-4">
                    <input
                      type="text"
                      placeholder="File Name"
                      value={file.name}
                      onChange={(e) => {
                        const newFiles = [...editingProject.files];
                        newFiles[index].name = e.target.value;
                        setEditingProject({...editingProject, files: newFiles});
                      }}
                      className="w-full bg-background/50 border border-white/10 rounded-lg px-4 py-2"
                    />
                    <input
                      type="text"
                      placeholder="File URL"
                      value={file.url}
                      onChange={(e) => {
                        const newFiles = [...editingProject.files];
                        newFiles[index].url = e.target.value;
                        setEditingProject({...editingProject, files: newFiles});
                      }}
                      className="w-full bg-background/50 border border-white/10 rounded-lg px-4 py-2"
                    />
                    <div className="flex gap-4">
                      <select
                        value={file.type}
                        onChange={(e) => {
                          const newFiles = [...editingProject.files];
                          newFiles[index].type = e.target.value as any;
                          setEditingProject({...editingProject, files: newFiles});
                        }}
                        className="bg-background/50 border border-white/10 rounded-lg px-4 py-2"
                      >
                        <option value="excel">Excel</option>
                        <option value="pdf">PDF</option>
                        <option value="word">Word</option>
                        <option value="image">Image</option>
                        <option value="video">Video</option>
                      </select>
                      <input
                        type="text"
                        placeholder="Size (e.g. Live Embed)"
                        value={file.size || ''}
                        onChange={(e) => {
                          const newFiles = [...editingProject.files];
                          newFiles[index].size = e.target.value;
                          setEditingProject({...editingProject, files: newFiles});
                        }}
                        className="flex-1 bg-background/50 border border-white/10 rounded-lg px-4 py-2"
                      />
                    </div>
                  </div>
                  <button 
                    type="button"
                    onClick={() => {
                      const newFiles = editingProject.files.filter((_, i) => i !== index);
                      setEditingProject({...editingProject, files: newFiles});
                    }}
                    className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={() => { setEditingProject(null); setIsAdding(false); }} className="px-6 py-2 rounded-lg hover:bg-white/5">
              Cancel
            </button>
            <button type="submit" className="px-6 py-2 bg-accent text-background font-medium rounded-lg hover:bg-accent/90 flex items-center gap-2">
              <Save className="w-4 h-4" /> Save Project
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex gap-4">
          <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/5 text-red-400">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Navigation */}
        <div className="w-full md:w-64 flex-shrink-0 flex flex-col gap-2 md:border-r border-white/10 md:pr-6">
          <button
            onClick={() => setActiveTab('projects')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors w-full text-left ${activeTab === 'projects' ? 'bg-accent text-background' : 'hover:bg-white/5'}`}
          >
            <LayoutDashboard className="w-5 h-5" /> Projects
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors w-full text-left ${activeTab === 'services' ? 'bg-accent text-background' : 'hover:bg-white/5'}`}
          >
            <Layers className="w-5 h-5" /> Services
          </button>
          <button
            onClick={() => setActiveTab('highlights')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors w-full text-left ${activeTab === 'highlights' ? 'bg-accent text-background' : 'hover:bg-white/5'}`}
          >
            <Star className="w-5 h-5" /> Highlights
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors w-full text-left ${activeTab === 'stats' ? 'bg-accent text-background' : 'hover:bg-white/5'}`}
          >
            <BarChart className="w-5 h-5" /> Stats
          </button>
          <button
            onClick={() => setActiveTab('tags')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors w-full text-left ${activeTab === 'tags' ? 'bg-accent text-background' : 'hover:bg-white/5'}`}
          >
            <Tag className="w-5 h-5" /> Tags
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors w-full text-left ${activeTab === 'settings' ? 'bg-accent text-background' : 'hover:bg-white/5'}`}
          >
            <SettingsIcon className="w-5 h-5" /> Site Settings
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 min-w-0">
          {activeTab === 'projects' && (
            <>
              <div className="flex justify-between items-center mb-4 gap-4">
                <select
                  value={selectedTag}
                  onChange={(e) => setSelectedTag(e.target.value)}
                  className="bg-background/50 border border-white/10 rounded-lg px-4 py-2 text-white"
                >
                  <option value="All">All Tags</option>
                  {Array.from(new Set(projects.flatMap(p => p.tags))).sort().map(tag => (
                    <option key={tag} value={tag}>{tag}</option>
                  ))}
                </select>
                <button 
                  onClick={() => {
                    setEditingProject({
                      id: Date.now().toString(),
                      title: '',
                      description: '',
                      category: 'Excel',
                      tags: [],
                      thumbnail: '',
                      files: []
                    });
                    setIsAdding(true);
                  }}
                  className="flex items-center gap-2 bg-accent text-background px-4 py-2 rounded-lg font-medium hover:bg-accent/90"
                >
                  <Plus className="w-4 h-4" /> Add Project
                </button>
              </div>
              <div className="grid gap-4">
                {projects.filter(p => selectedTag === 'All' || p.tags.includes(selectedTag)).map(project => (
                  <div key={project.id} className="glass-card p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <img src={project.thumbnail} alt={project.title} className="w-16 h-16 object-cover rounded-lg" />
                      <div>
                        <h3 className="font-bold">{project.title}</h3>
                        <p className="text-sm text-muted-foreground">{project.category} • {project.files.length} files</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => { setEditingProject(project); setIsAdding(false); }}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleDelete(project.id)}
                        className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
                {projects.filter(p => selectedTag === 'All' || p.tags.includes(selectedTag)).length === 0 && (
                  <div className="text-center py-12 text-muted-foreground glass-card">
                    {selectedTag === 'All' ? 'No projects found. Add your first project!' : `No projects found with tag: ${selectedTag}`}
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === 'services' && (
            <>
              <div className="flex justify-end mb-4">
                <button 
                  onClick={() => setEditingService({ title: '', description: '', index: -1 })}
                  className="flex items-center gap-2 bg-accent text-background px-4 py-2 rounded-lg font-medium hover:bg-accent/90"
                >
                  <Plus className="w-4 h-4" /> Add Service
                </button>
              </div>
              <div className="grid gap-4">
                {(() => {
                  let servicesList: any[] = [];
                  try { 
                    if (settings.services) {
                      servicesList = JSON.parse(settings.services);
                    } else {
                      servicesList = SERVICES.map(s => ({ title: s.title, description: s.description }));
                    }
                  } catch (e) {}
                  return servicesList.map((service, index) => (
                    <div key={index} className="glass-card p-4 flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-lg">{service.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{service.description}</p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button 
                          onClick={() => setEditingService({ ...service, index })}
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleDeleteService(index)}
                          className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ));
                })()}
                {settings.services === '[]' && (
                  <div className="text-center py-12 text-muted-foreground glass-card">
                    No services found. Add your first service!
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === 'highlights' && (
            <>
              <div className="flex justify-end mb-4">
                <button 
                  onClick={() => setEditingHighlight({ title: '', index: -1 })}
                  className="flex items-center gap-2 bg-accent text-background px-4 py-2 rounded-lg font-medium hover:bg-accent/90"
                >
                  <Plus className="w-4 h-4" /> Add Highlight
                </button>
              </div>
              <div className="grid gap-4">
                {(() => {
                  let highlightsList: any[] = [];
                  try { 
                    if (settings.highlights) {
                      highlightsList = JSON.parse(settings.highlights);
                    } else {
                      highlightsList = HIGHLIGHTS.map(h => ({ title: h.title }));
                    }
                  } catch (e) {}
                  return highlightsList.map((highlight, index) => (
                    <div key={index} className="glass-card p-4 flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-lg">{highlight.title}</h3>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button 
                          onClick={() => setEditingHighlight({ ...highlight, index })}
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleDeleteHighlight(index)}
                          className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ));
                })()}
                {settings.highlights === '[]' && (
                  <div className="text-center py-12 text-muted-foreground glass-card">
                    No highlights found. Add your first highlight!
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === 'stats' && (
            <>
              <div className="flex justify-end mb-4">
                <button 
                  onClick={() => setEditingStat({ label: '', value: '', index: -1 })}
                  className="flex items-center gap-2 bg-accent text-background px-4 py-2 rounded-lg font-medium hover:bg-accent/90"
                >
                  <Plus className="w-4 h-4" /> Add Stat
                </button>
              </div>
              <div className="grid gap-4">
                {(() => {
                  let statsList: any[] = [];
                  try { 
                    if (settings.stats) {
                      statsList = JSON.parse(settings.stats);
                    } else {
                      statsList = STATS.map(s => ({ label: s.label, value: s.value }));
                    }
                  } catch (e) {}
                  return statsList.map((stat, index) => (
                    <div key={index} className="glass-card p-4 flex items-center justify-between">
                      <div className="flex gap-8">
                        <div>
                          <p className="text-sm text-muted-foreground">Label</p>
                          <h3 className="font-bold text-lg">{stat.label}</h3>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Value</p>
                          <h3 className="font-bold text-lg">{stat.value}</h3>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button 
                          onClick={() => setEditingStat({ ...stat, index })}
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleDeleteStat(index)}
                          className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ));
                })()}
                {settings.stats === '[]' && (
                  <div className="text-center py-12 text-muted-foreground glass-card">
                    No stats found. Add your first stat!
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === 'tags' && (
            <>
              <div className="flex justify-end mb-4">
                <button 
                  onClick={() => setEditingTag({ name: '', index: -1 })}
                  className="flex items-center gap-2 bg-accent text-background px-4 py-2 rounded-lg font-medium hover:bg-accent/90"
                >
                  <Plus className="w-4 h-4" /> Add Tag
                </button>
              </div>
              <div className="grid gap-4">
                {(() => {
                  let tagsList: any[] = [];
                  try { 
                    if (settings.project_tags) {
                      tagsList = JSON.parse(settings.project_tags);
                    }
                  } catch (e) {}
                  return tagsList.map((tag, index) => (
                    <div key={index} className="glass-card p-4 flex items-center justify-between">
                      <h3 className="font-bold text-lg">{tag.name}</h3>
                      <div className="flex gap-2 ml-4">
                        <button 
                          onClick={() => setEditingTag({ ...tag, index })}
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleDeleteTag(index)}
                          className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ));
                })()}
                {(!settings.project_tags || settings.project_tags === '[]') && (
                  <div className="text-center py-12 text-muted-foreground glass-card">
                    No tags found. Add your first tag!
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === 'settings' && (
            <form onSubmit={handleSaveSettings} className="glass-card p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <h3 className="text-xl font-bold border-b border-white/10 pb-2 mb-4">Hero Section</h3>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Hero Title</label>
                  <input
                    type="text"
                    value={settings.hero_title || ''}
                    onChange={(e) => setSettings({...settings, hero_title: e.target.value})}
                    className="w-full bg-background/50 border border-white/10 rounded-lg px-4 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Hero Subtitle</label>
                  <input
                    type="text"
                    value={settings.hero_subtitle || ''}
                    onChange={(e) => setSettings({...settings, hero_subtitle: e.target.value})}
                    className="w-full bg-background/50 border border-white/10 rounded-lg px-4 py-2"
                  />
                </div>

                <div className="md:col-span-2 mt-4">
                  <h3 className="text-xl font-bold border-b border-white/10 pb-2 mb-4">About Section</h3>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-muted-foreground mb-1">About Text</label>
                  <textarea
                    value={settings.about_text || ''}
                    onChange={(e) => setSettings({...settings, about_text: e.target.value})}
                    className="w-full bg-background/50 border border-white/10 rounded-lg px-4 py-2 h-32"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Hero Image URL</label>
                  <input
                    type="url"
                    value={settings.hero_image || ''}
                    onChange={(e) => setSettings({...settings, hero_image: e.target.value})}
                    className="w-full bg-background/50 border border-white/10 rounded-lg px-4 py-2"
                  />
                </div>

                <div className="md:col-span-2 mt-4">
                  <h3 className="text-xl font-bold border-b border-white/10 pb-2 mb-4">Contact Information</h3>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Email</label>
                  <input
                    type="email"
                    value={settings.contact_email || ''}
                    onChange={(e) => setSettings({...settings, contact_email: e.target.value})}
                    className="w-full bg-background/50 border border-white/10 rounded-lg px-4 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Phone</label>
                  <input
                    type="text"
                    value={settings.contact_phone || ''}
                    onChange={(e) => setSettings({...settings, contact_phone: e.target.value})}
                    className="w-full bg-background/50 border border-white/10 rounded-lg px-4 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Location</label>
                  <input
                    type="text"
                    value={settings.contact_location || ''}
                    onChange={(e) => setSettings({...settings, contact_location: e.target.value})}
                    className="w-full bg-background/50 border border-white/10 rounded-lg px-4 py-2"
                  />
                </div>

              </div>

              <div className="flex justify-end pt-6 border-t border-white/10 items-center gap-4">
                {saveMessage && (
                  <span className={`text-sm ${saveMessage.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                    {saveMessage.text}
                  </span>
                )}
                <button 
                  type="submit" 
                  disabled={isSavingSettings}
                  className="px-6 py-2 bg-accent text-background font-medium rounded-lg hover:bg-accent/90 flex items-center gap-2 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" /> {isSavingSettings ? 'Saving...' : 'Save Settings'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background border border-white/10 p-6 rounded-xl max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Confirm Deletion</h3>
            <p className="text-muted-foreground mb-6">Are you sure you want to delete this item? This action cannot be undone.</p>
            <div className="flex justify-end gap-4">
              <button 
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 hover:bg-white/5 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  if (deleteConfirm.type === 'project') executeDeleteProject(deleteConfirm.id as string);
                  if (deleteConfirm.type === 'service') executeDeleteService(deleteConfirm.id as number);
                  if (deleteConfirm.type === 'highlight') executeDeleteHighlight(deleteConfirm.id as number);
                  if (deleteConfirm.type === 'stat') executeDeleteStat(deleteConfirm.id as number);
                  if (deleteConfirm.type === 'tag') executeDeleteTag(deleteConfirm.id as number);
                  setDeleteConfirm(null);
                }}
                className="px-4 py-2 bg-red-500/20 text-red-500 hover:bg-red-500/30 rounded-lg transition-colors font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
