import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Portfolio } from './pages/Portfolio';
import { Services } from './pages/Services';
import { Contact } from './pages/Contact';
import { ProjectDetail } from './pages/ProjectDetail';
import { Admin } from './pages/Admin';
import { SettingsProvider } from './context/SettingsContext';

export default function App() {
  return (
    <SettingsProvider>
      <div className="min-h-screen bg-background selection:bg-accent/30">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/project/:id" element={<ProjectDetail />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </SettingsProvider>
  );
}
