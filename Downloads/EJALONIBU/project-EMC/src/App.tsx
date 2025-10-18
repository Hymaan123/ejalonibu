import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import WorkProfiles from './components/WorkProfiles';
import WorkersProfiles from './components/WorkersProfiles';
import About from './components/About';
import Gallery from './components/Gallery';
import PaymentSystem from './components/PaymentSystem';
import Contact from './components/Contact';
import Footer from './components/Footer';
import LiveChat from './components/LiveChat';
import ProjectCalculator from './components/ProjectCalculator';
import ProjectTracker from './components/ProjectTracker';
import CustomerPortal from './components/CustomerPortal';
import VirtualConsultation from './components/VirtualConsultation';
import QualityAssurance from './components/QualityAssurance';
import MaintenanceScheduling from './components/MaintenanceScheduling';
import SuperAdminDashboard from './components/SuperAdminDashboard';
import AdminPortal from './components/AdminPortal';
import CurrencyProvider from './contexts/CurrencyContext';
import AuthProvider from './contexts/AuthContext';

function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <Services />
      <WorkProfiles />
      <WorkersProfiles />
      <About />
      <Gallery />
      <PaymentSystem />
      <Contact />
      <Footer />
      <LiveChat />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <CurrencyProvider>
        <Router>
          <div className="min-h-screen">
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#1e3a8a',
                  color: '#fff',
                },
              }}
            />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/calculator" element={<ProjectCalculator />} />
              <Route path="/tracker" element={<ProjectTracker />} />
              <Route path="/portal" element={<CustomerPortal />} />
              <Route path="/consultation" element={<VirtualConsultation />} />
              <Route path="/quality" element={<QualityAssurance />} />
              <Route path="/maintenance" element={<MaintenanceScheduling />} />
              <Route path="/admin-portal" element={<AdminPortal />} />
              <Route path="/admin" element={<SuperAdminDashboard />} />
            </Routes>
          </div>
        </Router>
      </CurrencyProvider>
    </AuthProvider>
  );
}

export default App;