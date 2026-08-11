import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User } from '../types';
import { X, Shield, Lock, Key } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen, onClose }) => {
  const { login } = useAuth();
  const [adminKey, setAdminKey] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Team Admin Secret Verification
    const adminUser: User = {
      userId: '11111111-1111-1111-1111-111111111111',
      name: 'System Admin (Platform Operator)',
      email: 'admin@localbooking.com',
      mobile: '+91 98470 00000',
      userType: 'ADMIN',
      status: 'ACTIVE'
    };
    login(adminUser, 'ADMIN_SECRET_JWT_TOKEN');
    onClose();
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 210, background: 'rgba(9, 13, 22, 0.92)', backdropFilter: 'blur(16px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      
      <div style={{ width: '100%', maxWidth: '400px', background: '#121826', border: '1px solid rgba(59, 130, 246, 0.4)', borderRadius: '24px', padding: '28px', position: 'relative', boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8)' }}>
        
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
        >
          <X size={20} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'rgba(59, 130, 246, 0.15)', border: '1px solid rgba(59, 130, 246, 0.3)', color: '#60a5fa', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px auto' }}>
            <Shield size={24} />
          </div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'white' }}>Platform Admin Portal</h2>
          <p style={{ fontSize: '0.775rem', color: '#94a3b8', marginTop: '2px' }}>
            Restricted System Operator Authentication
          </p>
        </div>

        <form onSubmit={handleAdminSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="search-input-group" style={{ background: '#0b111e' }}>
            <Key size={16} color="#3b82f6" />
            <input
              type="text"
              placeholder="Admin Username / Key"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              required
            />
          </div>

          <div className="search-input-group" style={{ background: '#0b111e' }}>
            <Lock size={16} color="#3b82f6" />
            <input
              type="password"
              placeholder="Secret Passcode"
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
            style={{ width: '100%', padding: '12px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', color: 'white', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', boxShadow: '0 4px 14px rgba(59, 130, 246, 0.3)' }}
          >
            AUTHENTICATE ADMIN
          </button>
        </form>

        <div style={{ marginTop: '16px', textAlign: 'center' }}>
          <button
            type="button"
            onClick={handleAdminSubmit}
            style={{ background: 'rgba(59, 130, 246, 0.15)', border: '1px solid rgba(59, 130, 246, 0.3)', color: '#60a5fa', padding: '6px 12px', borderRadius: '8px', fontSize: '0.725rem', fontWeight: 700, cursor: 'pointer' }}
          >
            ⚡ 1-Click Demo Admin Login
          </button>
        </div>

      </div>

    </div>
  );
};
