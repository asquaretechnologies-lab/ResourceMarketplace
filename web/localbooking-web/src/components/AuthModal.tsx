import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User } from '../types';
import { X, Lock, Mail, Phone, User as UserIcon } from 'lucide-react';
import axios from 'axios';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRole?: 'CUSTOMER' | 'OWNER';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialRole = 'CUSTOMER' }) => {
  const { login } = useAuth();
  const [isLoginView, setIsLoginView] = useState(true);
  const [userType, setUserType] = useState<'CUSTOMER' | 'OWNER'>(initialRole);
  
  const [emailOrMobile, setEmailOrMobile] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      if (isLoginView) {
        try {
          const res = await axios.post('http://localhost:5168/api/auth/login', {
            emailOrMobile,
            password
          });
          if (res.data.success) {
            login(res.data.user, res.data.token);
            onClose();
            return;
          }
        } catch {
          // Dev Instant Demo Fallback
        }

        const demoUser: User = {
          userId: userType === 'OWNER' ? '22222222-2222-2222-2222-222222222222' : '44444444-4444-4444-4444-444444444444',
          name: userType === 'OWNER' ? 'Aravind (Railway Parking Owner)' : 'Rahul Nair (Customer)',
          email: emailOrMobile || (userType === 'OWNER' ? 'aravind.owner@gmail.com' : 'rahul.nair@gmail.com'),
          mobile: '+91 98470 12345',
          userType: userType,
          status: 'ACTIVE'
        };
        login(demoUser, 'DEMO_JWT_TOKEN');
        onClose();
      } else {
        const newUser: User = {
          userId: 'demo-user-' + Math.random().toString(36).substring(7),
          name: name || 'New Account User',
          email: email || 'user@gmail.com',
          mobile: mobile || '+91 98765 43210',
          userType: userType,
          status: 'ACTIVE'
        };
        login(newUser, 'DEMO_JWT_TOKEN');
        onClose();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = (role: 'CUSTOMER' | 'OWNER') => {
    const demoUser: User = {
      userId: role === 'OWNER' ? '22222222-2222-2222-2222-222222222222' : '44444444-4444-4444-4444-444444444444',
      name: role === 'OWNER' ? 'Aravind (Railway Parking Owner)' : 'Rahul Nair (Customer)',
      email: role === 'OWNER' ? 'aravind.owner@gmail.com' : 'rahul.nair@gmail.com',
      mobile: '+91 98470 12345',
      userType: role,
      status: 'ACTIVE'
    };
    login(demoUser, 'DEMO_JWT_TOKEN');
    onClose();
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(9, 13, 22, 0.85)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      
      <div className="glass-panel" style={{ width: '100%', maxWidth: '420px', background: '#121826', border: '1px solid var(--border-emerald)', borderRadius: '24px', padding: '28px', position: 'relative', boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7)' }}>
        
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
        >
          <X size={20} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'white' }}>
            {isLoginView ? 'Account Login' : 'Create Account'}
          </h2>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '2px' }}>
            Select your account type to proceed
          </p>
        </div>

        {/* Customer vs Facility Owner Toggle (NO ADMIN OPTION HERE) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', background: '#090d16', padding: '4px', borderRadius: '12px', marginBottom: '20px', border: '1px solid var(--border-light)' }}>
          <button
            type="button"
            onClick={() => setUserType('CUSTOMER')}
            style={{ padding: '10px 4px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700, border: 'none', background: userType === 'CUSTOMER' ? 'var(--emerald-primary)' : 'transparent', color: userType === 'CUSTOMER' ? 'white' : '#94a3b8', cursor: 'pointer' }}
          >
            Customer
          </button>
          <button
            type="button"
            onClick={() => setUserType('OWNER')}
            style={{ padding: '10px 4px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700, border: 'none', background: userType === 'OWNER' ? 'var(--amber-primary)' : 'transparent', color: userType === 'OWNER' ? 'white' : '#94a3b8', cursor: 'pointer' }}
          >
            Facility Owner
          </button>
        </div>

        <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          
          {!isLoginView && (
            <div className="search-input-group" style={{ background: '#0b111e' }}>
              <UserIcon size={16} color="#94a3b8" />
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          {isLoginView ? (
            <div className="search-input-group" style={{ background: '#0b111e' }}>
              <Mail size={16} color="#94a3b8" />
              <input
                type="text"
                placeholder="Email or Mobile Number (+91...)"
                value={emailOrMobile}
                onChange={(e) => setEmailOrMobile(e.target.value)}
                required
              />
            </div>
          ) : (
            <>
              <div className="search-input-group" style={{ background: '#0b111e' }}>
                <Mail size={16} color="#94a3b8" />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="search-input-group" style={{ background: '#0b111e' }}>
                <Phone size={16} color="#94a3b8" />
                <input
                  type="tel"
                  placeholder="Mobile Number (+91...)"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  required
                />
              </div>
            </>
          )}

          <div className="search-input-group" style={{ background: '#0b111e' }}>
            <Lock size={16} color="#94a3b8" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {errorMsg && (
            <p style={{ fontSize: '0.75rem', color: '#f87171', textAlign: 'center' }}>{errorMsg}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-search"
            style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '0.85rem' }}
          >
            {loading ? 'Authenticating...' : isLoginView ? `LOGIN AS ${userType}` : 'REGISTER ACCOUNT'}
          </button>
        </form>

        {/* Quick Demo Logins Bar */}
        <div style={{ marginTop: '20px', borderTop: '1px solid var(--border-light)', paddingTop: '16px' }}>
          <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600, display: 'block', textAlign: 'center', marginBottom: '8px' }}>
            QUICK 1-CLICK DEMO LOGINS:
          </span>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <button
              onClick={() => handleQuickDemoLogin('CUSTOMER')}
              style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid var(--border-emerald)', color: '#34d399', padding: '8px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
            >
              Customer Demo Login
            </button>
            <button
              onClick={() => handleQuickDemoLogin('OWNER')}
              style={{ background: 'rgba(245, 158, 11, 0.15)', border: '1px solid var(--border-amber)', color: '#fbbf24', padding: '8px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
            >
              Owner Demo Login
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.8rem', color: '#94a3b8' }}>
          {isLoginView ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => setIsLoginView(!isLoginView)}
            style={{ background: 'transparent', border: 'none', color: '#10b981', fontWeight: 700, cursor: 'pointer' }}
          >
            {isLoginView ? 'Register' : 'Login'}
          </button>
        </div>

      </div>

    </div>
  );
};
