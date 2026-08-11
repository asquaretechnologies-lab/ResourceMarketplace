import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { AuthModal } from './AuthModal';
import { OwnerFacilityRegistrationModal } from './OwnerFacilityRegistrationModal';
import { Facility } from '../types';
import { Activity, Car, QrCode, LayoutDashboard, Shield, MapPin, User, LogOut, PlusCircle } from 'lucide-react';

interface NavbarProps {
  currentView: 'search' | 'bookings' | 'owner' | 'admin';
  setCurrentView: (view: 'search' | 'bookings' | 'owner' | 'admin') => void;
  activeCategory: 'ALL' | 'SPORTS' | 'PARKING';
  setActiveCategory: (cat: 'ALL' | 'SPORTS' | 'PARKING') => void;
  onFacilityCreated?: (facility: Facility) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  activeCategory,
  setActiveCategory,
  onFacilityCreated
}) => {
  const { user, logout, isAuthenticated } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isNewFacilityModalOpen, setIsNewFacilityModalOpen] = useState(false);
  const [authModalRole, setAuthModalRole] = useState<'CUSTOMER' | 'OWNER'>('CUSTOMER');

  const openLoginForRole = (role: 'CUSTOMER' | 'OWNER') => {
    setAuthModalRole(role);
    setIsAuthModalOpen(true);
  };

  const isCustomer = user?.userType === 'CUSTOMER';
  const isOwner = user?.userType === 'OWNER';
  const isAdmin = user?.userType === 'ADMIN';

  return (
    <>
      <header className="navbar-header">
        <div className="navbar-container">
          
          {/* Brand Logo */}
          <div onClick={() => {
            if (isOwner) setCurrentView('owner');
            else if (isAdmin) setCurrentView('admin');
            else setCurrentView('search');
          }} className="brand-logo">
            <div className="brand-icon-box">
              <Activity size={22} />
            </div>
            <div>
              <div className="brand-title">
                PLAY<span>&</span>PARK
              </div>
              <div style={{ fontSize: '10px', color: '#94a3b8', letterSpacing: '0.5px', textTransform: 'uppercase', fontWeight: 600 }}>
                {isOwner ? 'Facility Owner Console' : isAdmin ? 'Platform Admin Control' : 'Kerala Resource Marketplace'}
              </div>
            </div>
          </div>

          {/* Category Switcher Tabs - ONLY FOR CUSTOMER / GUEST */}
          {(!isAuthenticated || isCustomer) && currentView === 'search' && (
            <div className="category-tabs">
              <button
                onClick={() => setActiveCategory('ALL')}
                className={`category-btn ${activeCategory === 'ALL' ? 'active-all' : ''}`}
              >
                All Facilities
              </button>
              <button
                onClick={() => setActiveCategory('SPORTS')}
                className={`category-btn ${activeCategory === 'SPORTS' ? 'active-sports' : ''}`}
              >
                <Activity size={14} />
                Sports Turfs
              </button>
              <button
                onClick={() => setActiveCategory('PARKING')}
                className={`category-btn ${activeCategory === 'PARKING' ? 'active-parking' : ''}`}
              >
                <Car size={14} />
                Station Parking
              </button>
            </div>
          )}

          {/* Location Indicator */}
          {(!isAuthenticated || isCustomer) && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(18, 24, 38, 0.6)', padding: '6px 12px', borderRadius: '10px', fontSize: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <MapPin size={14} color="#10b981" />
              <span style={{ color: '#cbd5e1', fontWeight: 500 }}>Aluva / Kochi, KL</span>
            </div>
          )}

          {/* Strict Role-Based Nav Links (NO PUBLIC ADMIN LINK) */}
          <div className="nav-links">
            
            {/* GUEST VIEW: Find & Book ONLY */}
            {!isAuthenticated && (
              <>
                <button
                  onClick={() => setCurrentView('search')}
                  className={`nav-link-btn ${currentView === 'search' ? 'active' : ''}`}
                >
                  Find & Book
                </button>

                <button
                  onClick={() => openLoginForRole('CUSTOMER')}
                  className="btn-search"
                  style={{ padding: '6px 16px', fontSize: '0.75rem', borderRadius: '10px' }}
                >
                  <User size={14} /> LOGIN / REGISTER
                </button>
              </>
            )}

            {/* CUSTOMER LOGIN VIEW: Find & Book & My Tickets ONLY */}
            {isAuthenticated && isCustomer && (
              <>
                <button
                  onClick={() => setCurrentView('search')}
                  className={`nav-link-btn ${currentView === 'search' ? 'active' : ''}`}
                >
                  Find & Book
                </button>

                <button
                  onClick={() => setCurrentView('bookings')}
                  className={`nav-link-btn ${currentView === 'bookings' ? 'active-tickets' : ''}`}
                >
                  <QrCode size={16} />
                  My Tickets
                </button>
              </>
            )}

            {/* OWNER LOGIN VIEW: Owner Portal & + Add Facility ONLY */}
            {isAuthenticated && isOwner && (
              <>
                <button
                  onClick={() => setCurrentView('owner')}
                  className={`nav-link-btn ${currentView === 'owner' ? 'active-owner' : ''}`}
                >
                  <LayoutDashboard size={16} />
                  Owner Portal
                </button>

                <button
                  onClick={() => setIsNewFacilityModalOpen(true)}
                  style={{ padding: '8px 14px', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 700, border: 'none', background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <PlusCircle size={14} /> Add Facility
                </button>
              </>
            )}

            {/* ADMIN LOGIN VIEW: Only rendered when Admin is actively logged in */}
            {isAuthenticated && isAdmin && (
              <button
                onClick={() => setCurrentView('admin')}
                className={`nav-link-btn ${currentView === 'admin' ? 'active' : ''}`}
              >
                <Shield size={16} />
                Admin Portal
              </button>
            )}

            {/* User Account / Logout Badge */}
            {isAuthenticated && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '6px', paddingLeft: '10px', borderLeft: '1px solid var(--border-light)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', fontSize: '0.75rem', textAlign: 'right' }}>
                  <span style={{ fontWeight: 700, color: 'white' }}>{user?.name.split(' ')[0]}</span>
                  <span style={{ color: isOwner ? '#fbbf24' : isAdmin ? '#60a5fa' : '#10b981', fontSize: '0.65rem', fontWeight: 700 }}>
                    {user?.userType} ACCOUNT
                  </span>
                </div>
                <button
                  onClick={logout}
                  title="Logout"
                  style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', padding: '6px 10px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.7rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <LogOut size={12} /> Logout
                </button>
              </div>
            )}

          </div>

        </div>
      </header>

      {/* Auth Modal (Customer & Owner Only) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialRole={authModalRole}
      />

      {/* Owner Facility Registration Modal */}
      {onFacilityCreated && (
        <OwnerFacilityRegistrationModal
          isOpen={isNewFacilityModalOpen}
          onClose={() => setIsNewFacilityModalOpen(false)}
          onFacilityCreated={onFacilityCreated}
        />
      )}
    </>
  );
};
