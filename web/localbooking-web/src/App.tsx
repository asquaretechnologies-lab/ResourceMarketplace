import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AdminLoginModal } from './components/AdminLoginModal';
import { CustomerSearchPage } from './pages/CustomerSearchPage';
import { FacilityDetailsPage } from './pages/FacilityDetailsPage';
import { MyBookingsPage } from './pages/MyBookingsPage';
import { OwnerDashboardPage } from './pages/OwnerDashboardPage';
import { AdminPortalPage } from './pages/AdminPortalPage';
import { Facility, Booking } from './types';

function MainLayout() {
  const { user, isAuthenticated } = useAuth();
  const [currentView, setCurrentView] = useState<'search' | 'details' | 'bookings' | 'owner' | 'admin'>('search');
  const [activeCategory, setActiveCategory] = useState<'ALL' | 'SPORTS' | 'PARKING'>('ALL');
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [lastConfirmedBooking, setLastConfirmedBooking] = useState<Booking | null>(null);
  const [registeredFacilities, setRegisteredFacilities] = useState<Facility[]>([]);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  // Check URL param or keyboard shortcut for Admin secret access
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('admin') === 'true' || window.location.pathname === '/admin') {
      setIsAdminModalOpen(true);
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setIsAdminModalOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Automatically switch active view upon login role change
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.userType === 'OWNER') {
        setCurrentView('owner');
      } else if (user.userType === 'ADMIN') {
        setCurrentView('admin');
      } else if (user.userType === 'CUSTOMER') {
        setCurrentView('search');
      }
    } else {
      setCurrentView('search');
    }
  }, [isAuthenticated, user]);

  const handleSelectFacility = (facility: Facility) => {
    setSelectedFacility(facility);
    setCurrentView('details');
  };

  const handleBookingConfirmed = (booking: Booking) => {
    setLastConfirmedBooking(booking);
    setCurrentView('bookings');
  };

  const handleFacilityCreated = (facility: Facility) => {
    setRegisteredFacilities([facility, ...registeredFacilities]);
    alert(`Facility "${facility.name}" registered successfully! Submitted to Admin queue for land verification.`);
  };

  return (
    <div className="app-container">
      <div>
        <Navbar
          currentView={currentView === 'details' ? 'search' : currentView}
          setCurrentView={(v) => {
            setCurrentView(v);
            if (v === 'search') setSelectedFacility(null);
          }}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          onFacilityCreated={handleFacilityCreated}
        />

        <main className="main-content">
          {/* CUSTOMER & GUEST SEARCH VIEW */}
          {currentView === 'search' && (!user || user.userType === 'CUSTOMER') && (
            <CustomerSearchPage
              activeCategory={activeCategory}
              onSelectFacility={handleSelectFacility}
            />
          )}

          {/* FACILITY DETAILS PAGE */}
          {currentView === 'details' && selectedFacility && (!user || user.userType === 'CUSTOMER') && (
            <FacilityDetailsPage
              facility={selectedFacility}
              onBack={() => setCurrentView('search')}
              onBookingConfirmed={handleBookingConfirmed}
            />
          )}

          {/* CUSTOMER MY TICKETS VIEW */}
          {currentView === 'bookings' && (!user || user.userType === 'CUSTOMER') && (
            <MyBookingsPage initialBooking={lastConfirmedBooking} />
          )}

          {/* FACILITY OWNER PORTAL VIEW */}
          {(currentView === 'owner' || user?.userType === 'OWNER') && user?.userType === 'OWNER' && (
            <OwnerDashboardPage />
          )}

          {/* PLATFORM ADMIN PORTAL VIEW */}
          {(currentView === 'admin' || user?.userType === 'ADMIN') && user?.userType === 'ADMIN' && (
            <AdminPortalPage />
          )}
        </main>
      </div>

      <Footer />

      {/* Secret Admin Login Modal (Triggered via ?admin=true URL parameter or Ctrl+Shift+A) */}
      <AdminLoginModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
      />
    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
}

export default App;
