import React from 'react';
import { Activity, ShieldCheck, MapPin, Phone, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="footer-container">
      <div className="footer-inner">
        
        <div className="footer-grid">
          
          {/* Column 1: Brand & Tagline */}
          <div className="footer-col">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', padding: '6px' }}>
                <Activity size={20} />
              </div>
              <span className="brand-title" style={{ fontSize: '1.2rem' }}>
                PLAY<span>&</span>PARK
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: '1.5' }}>
              Kerala's unified resource booking engine for sports turfs, badminton courts, and railway station private land parking spaces.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#34d399', fontWeight: 600 }}>
              <ShieldCheck size={14} />
              <span>PostgreSQL Concurrency Protected Engine</span>
            </div>
          </div>

          {/* Column 2: Categories */}
          <div className="footer-col">
            <h4 className="footer-col-title">Facility Categories</h4>
            <ul className="footer-col-list">
              <li>Railway Station Parking (Aluva & South)</li>
              <li>7's & 5's Football Turfs</li>
              <li>Indoor Wooden Badminton Courts</li>
              <li>Pickleball & Padel Arenas</li>
              <li>EV Car Charging & Bike Slots</li>
            </ul>
          </div>

          {/* Column 3: Locations */}
          <div className="footer-col">
            <h4 className="footer-col-title">Primary Coverage</h4>
            <ul className="footer-col-list">
              <li>Aluva Railway Station & Metro</li>
              <li>Ernakulam South Junction</li>
              <li>Thrissur Railway Station</li>
              <li>Kakkanad Infopark Expressway</li>
              <li>Edappally Lulu Mall Area</li>
            </ul>
          </div>

          {/* Column 4: Contact Support */}
          <div className="footer-col">
            <h4 className="footer-col-title">Support & Owner Helpline</h4>
            <ul className="footer-col-list">
              <li style={{ cursor: 'default', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Phone size={14} color="#10b981" />
                <span>+91 98470 12345 (Kerala)</span>
              </li>
              <li style={{ cursor: 'default', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={14} color="#10b981" />
                <span>support@playandpark.in</span>
              </li>
              <li style={{ cursor: 'default', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={14} color="#10b981" />
                <span>Kochi, Kerala 682030</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="footer-bottom">
          <p>© 2026 PlayAndPark Local Booking Marketplace. All rights reserved.</p>
          <p>Powered by ASP.NET Core 8 Web API & PostgreSQL Row Locking Engine</p>
        </div>

      </div>
    </footer>
  );
};
