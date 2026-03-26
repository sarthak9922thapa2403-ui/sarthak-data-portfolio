import React, { createContext, useContext, useState, useEffect } from 'react';
import { SERVICES } from '../constants';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

export interface SiteSettings {
  hero_title: string;
  hero_subtitle: string;
  about_text: string;
  contact_email: string;
  contact_phone: string;
  contact_location: string;
  social_linkedin: string;
  social_upwork: string;
  social_fiverr: string;
  social_links: string;
  hero_image: string;
  services: string;
  highlights: string;
  stats: string;
  project_tags: string;
}

const defaultSettings: SiteSettings = {
  hero_title: 'Data Entry & Processing Specialist',
  hero_subtitle: 'Transforming raw data into actionable insights with precision and speed.',
  about_text: 'I am a dedicated data specialist with expertise in Excel, data cleaning, and processing. I help businesses organize their data efficiently so they can make better decisions.',
  contact_email: 'sarthak9922thapa2403@gmail.com',
  contact_phone: '+91 9368579922',
  contact_location: 'New York, NY',
  social_linkedin: 'https://linkedin.com',
  social_upwork: 'https://upwork.com',
  social_fiverr: 'https://fiverr.com',
  social_links: '[]',
  hero_image: '',
  services: JSON.stringify(SERVICES.map(s => ({ title: s.title, description: s.description, imageUrl: s.imageUrl }))),
  highlights: '[]',
  stats: '[]',
  project_tags: '[]'
};

const SettingsContext = createContext<{ settings: SiteSettings; isLoading: boolean }>({
  settings: defaultSettings,
  isLoading: true
});

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const settingsRef = doc(db, 'settings', 'site_settings');
    
    // Set up real-time listener
    const unsubscribe = onSnapshot(settingsRef, (docSnap) => {
      if (docSnap.exists()) {
        setSettings({ ...defaultSettings, ...docSnap.data() as SiteSettings });
      } else {
        setSettings(defaultSettings);
      }
      setIsLoading(false);
    }, (error) => {
      console.error('Error fetching settings from Firebase:', error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, isLoading }}>
      {children}
    </SettingsContext.Provider>
  );
};
