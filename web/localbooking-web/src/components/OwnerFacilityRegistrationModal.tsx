import React, { useState } from 'react';
import { Facility } from '../types';
import { X, Building, MapPin, Car, Activity, Bike, FileText, CheckCircle, Clock, Upload } from 'lucide-react';

interface OwnerFacilityRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFacilityCreated: (facility: Facility) => void;
}

export const OwnerFacilityRegistrationModal: React.FC<OwnerFacilityRegistrationModalProps> = ({
  isOpen,
  onClose,
  onFacilityCreated
}) => {
  const [facilityType, setFacilityType] = useState<'PARKING' | 'SPORTS' | 'RENTAL'>('PARKING');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [district, setDistrict] = useState('Ernakulam');
  const [landmark, setLandmark] = useState('');
  const [is24Hours, setIs24Hours] = useState(true);
  const [carCapacity, setCarCapacity] = useState(30);
  const [carPrice, setCarPrice] = useState(30);
  const [bikeCapacity, setBikeCapacity] = useState(100);
  const [bikePrice, setBikePrice] = useState(10);
  const [documentName, setDocumentName] = useState('Land_Ownership_Authorization.pdf');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newFacility: Facility = {
      facilityId: 'f-new-' + Math.random().toString(36).substring(7),
      name: name || (facilityType === 'PARKING' ? 'Aluva Station Private Parking' : 'Kochi Sports Turf'),
      description: description || 'Private land resource open for public booking.',
      address: address || 'Station Road, Aluva',
      district: district,
      state: 'Kerala',
      postalCode: '683101',
      latitude: 10.1084,
      longitude: 76.3572,
      landmark: landmark || 'Near Railway Station',
      distanceKm: 0.5,
      is24Hours: is24Hours,
      openingTime: '06:00',
      closingTime: '22:00',
      facilityType: facilityType,
      status: 'PENDING_REVIEW',
      rating: 5.0,
      reviewCount: 1,
      photos: [
        facilityType === 'PARKING' 
          ? 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=800&q=80' 
          : 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&w=800&q=80'
      ],
      features: ['CCTV', 'Security Guard', '24 Hours', 'Land Verified'],
      parkingAreas: facilityType === 'PARKING' ? [
        {
          parkingAreaId: 'pa-new-1',
          vehicleTypeId: 2,
          vehicleTypeCode: 'CAR',
          vehicleTypeName: 'Car Parking',
          totalCapacity: Number(carCapacity),
          availableCapacity: Number(carCapacity),
          pricePerHour: Number(carPrice),
          pricePerDay: Number(carPrice) * 7,
          pricePerOvernight: Number(carPrice) * 8,
          pricePerMonth: Number(carPrice) * 120
        },
        {
          parkingAreaId: 'pa-new-2',
          vehicleTypeId: 1,
          vehicleTypeCode: 'TWO_WHEELER',
          vehicleTypeName: 'Two Wheeler / Bike',
          totalCapacity: Number(bikeCapacity),
          availableCapacity: Number(bikeCapacity),
          pricePerHour: Number(bikePrice),
          pricePerDay: Number(bikePrice) * 8,
          pricePerOvernight: Number(bikePrice) * 10,
          pricePerMonth: Number(bikePrice) * 150
        }
      ] : [],
      resources: facilityType === 'SPORTS' ? [
        {
          resourceId: 'res-new-1',
          name: name || '7\'s Football Turf',
          description: 'FIFA Pro Artificial Turf Ground.',
          sportsTypeId: 1,
          sportsTypeName: 'Football',
          capacity: 14,
          slotDurationMinutes: 60,
          pricePerHour: 1200,
          isAvailable: true
        }
      ] : []
    };

    onFacilityCreated(newFacility);
    onClose();
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(9, 13, 22, 0.85)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', overflowY: 'auto' }}>
      
      <div className="glass-panel" style={{ width: '100%', maxWidth: '640px', background: '#121826', border: '1px solid var(--border-amber)', borderRadius: '24px', padding: '28px', position: 'relative', boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7)', margin: 'auto' }}>
        
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
        >
          <X size={20} />
        </button>

        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', borderRadius: '20px', background: 'rgba(245, 158, 11, 0.15)', border: '1px solid var(--border-amber)', color: '#fbbf24', fontSize: '0.75rem', fontWeight: 600, marginBottom: '6px' }}>
            <Building size={14} />
            <span>New Facility Registration</span>
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'white' }}>Register Land or Sports Facility</h2>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '2px' }}>
            List your private land near station or sports turf for online customer bookings
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Facility Type Switcher */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
            <button
              type="button"
              onClick={() => setFacilityType('PARKING')}
              style={{ padding: '10px', borderRadius: '12px', border: '1px solid', borderColor: facilityType === 'PARKING' ? 'var(--amber-primary)' : 'var(--border-light)', background: facilityType === 'PARKING' ? 'rgba(245, 158, 11, 0.15)' : '#0b111e', color: facilityType === 'PARKING' ? '#fbbf24' : '#94a3b8', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
            >
              <Car size={15} /> Parking
            </button>
            <button
              type="button"
              onClick={() => setFacilityType('SPORTS')}
              style={{ padding: '10px', borderRadius: '12px', border: '1px solid', borderColor: facilityType === 'SPORTS' ? 'var(--emerald-primary)' : 'var(--border-light)', background: facilityType === 'SPORTS' ? 'rgba(16, 185, 129, 0.15)' : '#0b111e', color: facilityType === 'SPORTS' ? '#34d399' : '#94a3b8', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
            >
              <Activity size={15} /> Sports Turf
            </button>
            <button
              type="button"
              onClick={() => setFacilityType('RENTAL')}
              style={{ padding: '10px', borderRadius: '12px', border: '1px solid', borderColor: facilityType === 'RENTAL' ? '#38bdf8' : 'var(--border-light)', background: facilityType === 'RENTAL' ? 'rgba(56, 189, 248, 0.15)' : '#0b111e', color: facilityType === 'RENTAL' ? '#38bdf8' : '#94a3b8', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
            >
              <Bike size={15} /> Rentals
            </button>
          </div>

          {/* Basic Information */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input
              type="text"
              placeholder="Facility Name (e.g. Aluva Railway Station Parking)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{ background: '#0b111e', border: '1px solid var(--border-light)', borderRadius: '10px', padding: '10px 14px', fontSize: '0.85rem', color: 'white', outline: 'none' }}
            />

            <textarea
              placeholder="Description & Facilities (CCTV, Security, Covered, Night Lights)..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              style={{ background: '#0b111e', border: '1px solid var(--border-light)', borderRadius: '10px', padding: '10px 14px', fontSize: '0.85rem', color: 'white', outline: 'none', resize: 'none' }}
            />
          </div>

          {/* Address & Landmark */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <input
              type="text"
              placeholder="Address / Station Road"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              style={{ background: '#0b111e', border: '1px solid var(--border-light)', borderRadius: '10px', padding: '10px 14px', fontSize: '0.85rem', color: 'white', outline: 'none' }}
            />
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              style={{ background: '#0b111e', border: '1px solid var(--border-light)', borderRadius: '10px', padding: '10px 14px', fontSize: '0.85rem', color: 'white', outline: 'none' }}
            >
              <option value="Ernakulam">Ernakulam / Kochi</option>
              <option value="Thrissur">Thrissur</option>
              <option value="Trivandrum">Thiruvananthapuram</option>
            </select>
          </div>

          <input
            type="text"
            placeholder="Nearby Landmark (e.g. 350m from Aluva Railway Station)"
            value={landmark}
            onChange={(e) => setLandmark(e.target.value)}
            style={{ background: '#0b111e', border: '1px solid var(--border-light)', borderRadius: '10px', padding: '10px 14px', fontSize: '0.85rem', color: 'white', outline: 'none' }}
          />

          {/* Parking Capacities Configuration */}
          {facilityType === 'PARKING' && (
            <div style={{ background: '#090d16', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fbbf24' }}>Configure Capacities & Hourly Pricing</span>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.7rem', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>Car Total Capacity</label>
                  <input
                    type="number"
                    value={carCapacity}
                    onChange={(e) => setCarCapacity(Number(e.target.value))}
                    style={{ width: '100%', background: '#0b111e', border: '1px solid var(--border-light)', borderRadius: '8px', padding: '6px 10px', fontSize: '0.8rem', color: 'white' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.7rem', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>Car Hourly Rate (₹)</label>
                  <input
                    type="number"
                    value={carPrice}
                    onChange={(e) => setCarPrice(Number(e.target.value))}
                    style={{ width: '100%', background: '#0b111e', border: '1px solid var(--border-light)', borderRadius: '8px', padding: '6px 10px', fontSize: '0.8rem', color: 'white' }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Land Ownership Proof Document Upload */}
          <div style={{ background: '#090d16', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={18} color="#3b82f6" />
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'white', display: 'block' }}>Land Ownership Proof Document</span>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{documentName}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setDocumentName('Verified_Ownership_TaxReceipt_2026.pdf')}
              style={{ padding: '6px 12px', borderRadius: '8px', background: 'rgba(59, 130, 246, 0.2)', border: '1px solid rgba(59, 130, 246, 0.3)', color: '#60a5fa', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <Upload size={12} /> Upload PDF
            </button>
          </div>

          <button
            type="submit"
            className="btn-book-now parking"
            style={{ width: '100%', padding: '12px', fontSize: '0.85rem', justifyContent: 'center' }}
          >
            SUBMIT FACILITY FOR ADMIN APPROVAL
          </button>

        </form>

      </div>

    </div>
  );
};
