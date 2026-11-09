import React, { useState } from 'react';
import { Facility } from '../types';
import { 
  X, Building, MapPin, Car, Activity, Bike, FileText, CheckCircle, 
  Clock, Upload, Shield, Key, Phone, DollarSign, Sparkles, Check
} from 'lucide-react';

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
  const [facilityType, setFacilityType] = useState<'PARKING' | 'SPORTS' | 'RENTAL'>('RENTAL');
  
  // Common Facility Info
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [district, setDistrict] = useState('Ernakulam');
  const [landmark, setLandmark] = useState('');
  const [is24Hours, setIs24Hours] = useState(true);

  // Parking Specific Fields
  const [carCapacity, setCarCapacity] = useState(30);
  const [carPrice, setCarPrice] = useState(30);
  const [bikeCapacity, setBikeCapacity] = useState(100);
  const [bikePrice, setBikePrice] = useState(10);

  // Sports Turf Specific Fields
  const [turfSport, setTurfSport] = useState('Football (7s Turf)');
  const [turfHourlyPrice, setTurfHourlyPrice] = useState(1200);

  // Rental Specific Fields: 2-Wheeler vs 4-Wheeler
  const [rentalCategory, setRentalCategory] = useState<'TWO_WHEELER' | 'FOUR_WHEELER' | 'BOTH'>('TWO_WHEELER');
  
  // 2-Wheeler Fleet & Pricing
  const [twoWheelerFleetSize, setTwoWheelerFleetSize] = useState(8);
  const [twoWheelerDailyRate, setTwoWheelerDailyRate] = useState(650);
  const [twoWheelerHourlyRate, setTwoWheelerHourlyRate] = useState(70);
  const [twoWheelerDeposit, setTwoWheelerDeposit] = useState(1000);
  const [twoWheelerFreeKm, setTwoWheelerFreeKm] = useState(150);
  const [twoWheelerExtraKmCharge, setTwoWheelerExtraKmCharge] = useState(3);
  const [twoWheelerHelmetsIncluded, setTwoWheelerHelmetsIncluded] = useState(true);
  const [twoWheelerSelectedModels, setTwoWheelerSelectedModels] = useState<string[]>([
    'Honda Activa 6G',
    'Royal Enfield Classic 350'
  ]);

  // 4-Wheeler Fleet & Pricing
  const [fourWheelerFleetSize, setFourWheelerFleetSize] = useState(4);
  const [fourWheelerDailyRate, setFourWheelerDailyRate] = useState(2400);
  const [fourWheelerHourlyRate, setFourWheelerHourlyRate] = useState(220);
  const [fourWheelerDeposit, setFourWheelerDeposit] = useState(4000);
  const [fourWheelerFreeKm, setFourWheelerFreeKm] = useState(250);
  const [fourWheelerExtraKmCharge, setFourWheelerExtraKmCharge] = useState(10);
  const [fourWheelerTransmission, setFourWheelerTransmission] = useState<'MANUAL' | 'AUTOMATIC' | 'BOTH'>('BOTH');
  const [fourWheelerWithDriver, setFourWheelerWithDriver] = useState(true);
  const [fourWheelerFastag, setFourWheelerFastag] = useState(true);
  const [fourWheelerSelectedModels, setFourWheelerSelectedModels] = useState<string[]>([
    'Maruti Swift ZXi',
    'Mahindra Thar 4x4'
  ]);

  // Rental Business Operational Details
  const [contactPhone, setContactPhone] = useState('+91 98471 23456');
  const [upiVpa, setUpiVpa] = useState('keralarides@okaxis');
  const [offersDelivery, setOffersDelivery] = useState(true);
  const [deliveryFee, setDeliveryFee] = useState(150);
  const [fuelPolicy, setFuelPolicy] = useState<'SAME_TO_SAME' | 'FULL_TO_FULL'>('SAME_TO_SAME');

  // Documents
  const [documentName, setDocumentName] = useState('TwoWheeler_Rental_RTO_Permit.pdf');

  if (!isOpen) return null;

  // Toggle model selection
  const toggleTwoWheelerModel = (model: string) => {
    setTwoWheelerSelectedModels(prev => 
      prev.includes(model) ? prev.filter(m => m !== model) : [...prev, model]
    );
  };

  const toggleFourWheelerModel = (model: string) => {
    setFourWheelerSelectedModels(prev => 
      prev.includes(model) ? prev.filter(m => m !== model) : [...prev, model]
    );
  };

  const handleFacilityTypeChange = (type: 'PARKING' | 'SPORTS' | 'RENTAL') => {
    setFacilityType(type);
    if (type === 'RENTAL') {
      if (rentalCategory === 'TWO_WHEELER') setDocumentName('TwoWheeler_Rental_RTO_Permit.pdf');
      else if (rentalCategory === 'FOUR_WHEELER') setDocumentName('RentACab_Commercial_License.pdf');
      else setDocumentName('Commercial_Fleet_Rental_Permit.pdf');
    } else if (type === 'PARKING') {
      setDocumentName('Land_Ownership_Authorization.pdf');
    } else {
      setDocumentName('Sports_Arena_Lease_Agreement.pdf');
    }
  };

  const handleRentalCategoryChange = (cat: 'TWO_WHEELER' | 'FOUR_WHEELER' | 'BOTH') => {
    setRentalCategory(cat);
    if (cat === 'TWO_WHEELER') setDocumentName('TwoWheeler_Rental_RTO_Permit.pdf');
    else if (cat === 'FOUR_WHEELER') setDocumentName('RentACab_Commercial_License.pdf');
    else setDocumentName('Commercial_Fleet_Rental_Permit.pdf');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Features builder based on type
    let computedFeatures: string[] = ['Verified Partner', 'Online Booking'];
    let computedPhotos: string[] = [];
    
    if (facilityType === 'PARKING') {
      computedFeatures = ['CCTV', 'Security Guard', '24 Hours', 'Land Verified', 'EV Charging Available'];
      computedPhotos = ['https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=800&q=80'];
    } else if (facilityType === 'SPORTS') {
      computedFeatures = ['FIFA Approved Turf', 'Night Floodlights', 'Locker Room', 'Dressing Area', 'Water & First-Aid'];
      computedPhotos = ['https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&w=800&q=80'];
    } else {
      // RENTAL
      if (rentalCategory === 'TWO_WHEELER') {
        computedFeatures = [
          '2-Wheeler Fleet',
          twoWheelerHelmetsIncluded ? '2 Free Helmets' : 'Helmets On-Demand',
          `${twoWheelerFreeKm} KM/Day Free`,
          'Self Drive',
          offersDelivery ? `Doorstep Delivery (₹${deliveryFee})` : 'Pickup at Hub',
          'Instant UPI Deposit Refund'
        ];
        computedPhotos = ['https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80'];
      } else if (rentalCategory === 'FOUR_WHEELER') {
        computedFeatures = [
          '4-Wheeler Fleet',
          fourWheelerWithDriver ? 'Self-Drive & With Driver' : 'Self-Drive Only',
          fourWheelerFastag ? 'Fastag & AC Included' : 'AC Vehicles',
          `${fourWheelerFreeKm} KM/Day Free`,
          offersDelivery ? `Doorstep Delivery (₹${deliveryFee})` : 'Pickup at Hub',
          'Commercial Insured'
        ];
        computedPhotos = ['https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80'];
      } else {
        computedFeatures = [
          '2W & 4W Full Fleet',
          'Bikes, Scooters & Cars',
          twoWheelerHelmetsIncluded ? 'Free Helmets' : 'Helmets Available',
          fourWheelerWithDriver ? 'Chauffeur Option' : 'Self Drive',
          'Doorstep Hotel Delivery',
          'Instant UPI Settlement'
        ];
        computedPhotos = ['https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80'];
      }
    }

    const newFacility: Facility = {
      facilityId: 'f-new-' + Math.random().toString(36).substring(7),
      name: name || (
        facilityType === 'PARKING' ? 'Aluva Station Private Parking' :
        facilityType === 'SPORTS' ? 'Kochi Sports Turf Arena' :
        rentalCategory === 'TWO_WHEELER' ? 'Kochi Royal Wheels (2-Wheeler Rentals)' :
        rentalCategory === 'FOUR_WHEELER' ? 'Kerala Self-Drive Cars (4-Wheeler Rentals)' :
        'Fort Kochi Wheels (Bike & Car Rentals)'
      ),
      description: description || (
        facilityType === 'RENTAL' 
          ? `Premium tourist and local vehicle rentals in ${district}. Verified vehicles with clean maintenance and roadside assistance.`
          : 'Private facility open for verified online customer bookings.'
      ),
      address: address || 'Station Road, Aluva',
      district: district,
      state: 'Kerala',
      postalCode: '683101',
      latitude: 10.1084,
      longitude: 76.3572,
      landmark: landmark || (facilityType === 'RENTAL' ? 'Near Railway Station / Hub' : 'Near Railway Station'),
      distanceKm: 0.5,
      is24Hours: is24Hours,
      openingTime: '06:00',
      closingTime: '22:00',
      facilityType: facilityType,
      status: 'PENDING_REVIEW',
      rating: 5.0,
      reviewCount: 1,
      photos: computedPhotos,
      features: computedFeatures,
      
      // Rental specific settings
      contactPhone: contactPhone,
      upiVpa: upiVpa,
      upiPayeeName: name || 'Kerala Rentals Hub',
      acceptsDirectUpi: true,
      acceptsCash: true,
      offersDriver: rentalCategory === 'FOUR_WHEELER' || rentalCategory === 'BOTH' ? fourWheelerWithDriver : false,
      offersDelivery: offersDelivery,
      deliveryFeeFlat: deliveryFee,

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
          name: turfSport,
          description: 'FIFA Pro Artificial Turf Ground with LED Floodlights.',
          sportsTypeId: 1,
          sportsTypeName: 'Football',
          capacity: 14,
          slotDurationMinutes: 60,
          pricePerHour: turfHourlyPrice,
          isAvailable: true
        }
      ] : facilityType === 'RENTAL' ? [
        ...(rentalCategory === 'TWO_WHEELER' || rentalCategory === 'BOTH' ? [
          {
            resourceId: 'res-2w-1',
            name: `2-Wheeler Fleet (${twoWheelerFleetSize} Bikes Available)`,
            description: twoWheelerSelectedModels.join(', ') || 'Scooters & Geared Bikes',
            capacity: twoWheelerFleetSize,
            slotDurationMinutes: 1440,
            pricePerHour: twoWheelerDailyRate,
            isAvailable: true
          }
        ] : []),
        ...(rentalCategory === 'FOUR_WHEELER' || rentalCategory === 'BOTH' ? [
          {
            resourceId: 'res-4w-1',
            name: `4-Wheeler Fleet (${fourWheelerFleetSize} Cars Available)`,
            description: fourWheelerSelectedModels.join(', ') || 'Hatchback, Sedan & SUVs',
            capacity: fourWheelerFleetSize,
            slotDurationMinutes: 1440,
            pricePerHour: fourWheelerDailyRate,
            isAvailable: true
          }
        ] : [])
      ] : []
    };

    onFacilityCreated(newFacility);
    onClose();
  };

  const isRental = facilityType === 'RENTAL';
  const isParking = facilityType === 'PARKING';
  const isSports = facilityType === 'SPORTS';

  return (
    <div style={{ 
      position: 'fixed', 
      inset: 0, 
      zIndex: 200, 
      background: 'rgba(9, 13, 22, 0.88)', 
      backdropFilter: 'blur(12px)', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: '16px', 
      overflowY: 'auto' 
    }}>
      
      <div className="glass-panel" style={{ 
        width: '100%', 
        maxWidth: '700px', 
        background: '#121826', 
        border: isRental ? '1px solid rgba(56, 189, 248, 0.35)' : isSports ? '1px solid rgba(16, 185, 129, 0.35)' : '1px solid var(--border-amber)', 
        borderRadius: '24px', 
        padding: '24px 28px', 
        position: 'relative', 
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8)', 
        margin: 'auto',
        maxHeight: '92vh',
        overflowY: 'auto'
      }}>
        
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div style={{ marginBottom: '18px' }}>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '6px', 
            padding: '4px 12px', 
            borderRadius: '20px', 
            background: isRental ? 'rgba(56, 189, 248, 0.15)' : isSports ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)', 
            border: isRental ? '1px solid rgba(56, 189, 248, 0.3)' : isSports ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid var(--border-amber)', 
            color: isRental ? '#38bdf8' : isSports ? '#34d399' : '#fbbf24', 
            fontSize: '0.75rem', 
            fontWeight: 700, 
            marginBottom: '6px' 
          }}>
            {isRental ? <Bike size={14} /> : isSports ? <Activity size={14} /> : <Building size={14} />}
            <span>
              {isRental ? 'Vehicle Rentals Registration' : isSports ? 'Sports Turf Registration' : 'Land Parking Registration'}
            </span>
          </div>
          
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'white', margin: '2px 0 4px 0' }}>
            {isRental 
              ? 'Register 2-Wheeler or 4-Wheeler Rental Fleet' 
              : isSports 
              ? 'Register Sports Turf or Ground' 
              : 'Register Land or Station Parking'}
          </h2>
          
          <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0 }}>
            {isRental 
              ? 'List your bike, scooter, or car rental business for tourist and commuter bookings across Kerala' 
              : isSports 
              ? 'List your sports court, turf, or arena for hourly customer slot reservations' 
              : 'List your private land near railway station or junction for vehicle parking'}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Main Facility Type Switcher */}
          <div>
            <label style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block', marginBottom: '6px', fontWeight: 600 }}>
              SELECT FACILITY BUSINESS CATEGORY:
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
              <button
                type="button"
                onClick={() => handleFacilityTypeChange('PARKING')}
                style={{ 
                  padding: '10px', 
                  borderRadius: '12px', 
                  border: '1px solid', 
                  borderColor: isParking ? 'var(--amber-primary)' : 'rgba(255, 255, 255, 0.1)', 
                  background: isParking ? 'rgba(245, 158, 11, 0.18)' : '#0b111e', 
                  color: isParking ? '#fbbf24' : '#94a3b8', 
                  fontSize: '0.78rem', 
                  fontWeight: 700, 
                  cursor: 'pointer', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: '6px' 
                }}
              >
                <Car size={15} /> Parking
              </button>
              
              <button
                type="button"
                onClick={() => handleFacilityTypeChange('SPORTS')}
                style={{ 
                  padding: '10px', 
                  borderRadius: '12px', 
                  border: '1px solid', 
                  borderColor: isSports ? 'var(--emerald-primary)' : 'rgba(255, 255, 255, 0.1)', 
                  background: isSports ? 'rgba(16, 185, 129, 0.18)' : '#0b111e', 
                  color: isSports ? '#34d399' : '#94a3b8', 
                  fontSize: '0.78rem', 
                  fontWeight: 700, 
                  cursor: 'pointer', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: '6px' 
                }}
              >
                <Activity size={15} /> Sports Turf
              </button>
              
              <button
                type="button"
                onClick={() => handleFacilityTypeChange('RENTAL')}
                style={{ 
                  padding: '10px', 
                  borderRadius: '12px', 
                  border: '1px solid', 
                  borderColor: isRental ? '#38bdf8' : 'rgba(255, 255, 255, 0.1)', 
                  background: isRental ? 'rgba(56, 189, 248, 0.18)' : '#0b111e', 
                  color: isRental ? '#38bdf8' : '#94a3b8', 
                  fontSize: '0.78rem', 
                  fontWeight: 700, 
                  cursor: 'pointer', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: '6px' 
                }}
              >
                <Bike size={15} /> Rentals
              </button>
            </div>
          </div>

          {/* ======================================================== */}
          {/* RENTAL SUB-CATEGORY SELECTOR: 2-WHEELERS vs 4-WHEELERS   */}
          {/* ======================================================== */}
          {isRental && (
            <div style={{ 
              background: 'rgba(56, 189, 248, 0.08)', 
              border: '1px solid rgba(56, 189, 248, 0.25)', 
              borderRadius: '14px', 
              padding: '14px' 
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Key size={14} /> SELECT RENTAL VEHICLE CATEGORY:
                </span>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                  Fields dynamically adapt below
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => handleRentalCategoryChange('TWO_WHEELER')}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '10px',
                    border: '1px solid',
                    borderColor: rentalCategory === 'TWO_WHEELER' ? '#38bdf8' : 'rgba(255, 255, 255, 0.1)',
                    background: rentalCategory === 'TWO_WHEELER' ? 'rgba(56, 189, 248, 0.25)' : '#0b111e',
                    color: rentalCategory === 'TWO_WHEELER' ? '#ffffff' : '#94a3b8',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <Bike size={14} color={rentalCategory === 'TWO_WHEELER' ? '#38bdf8' : '#94a3b8'} />
                  <span>2 Wheelers</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleRentalCategoryChange('FOUR_WHEELER')}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '10px',
                    border: '1px solid',
                    borderColor: rentalCategory === 'FOUR_WHEELER' ? '#10b981' : 'rgba(255, 255, 255, 0.1)',
                    background: rentalCategory === 'FOUR_WHEELER' ? 'rgba(16, 185, 129, 0.25)' : '#0b111e',
                    color: rentalCategory === 'FOUR_WHEELER' ? '#ffffff' : '#94a3b8',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <Car size={14} color={rentalCategory === 'FOUR_WHEELER' ? '#34d399' : '#94a3b8'} />
                  <span>4 Wheelers</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleRentalCategoryChange('BOTH')}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '10px',
                    border: '1px solid',
                    borderColor: rentalCategory === 'BOTH' ? '#f59e0b' : 'rgba(255, 255, 255, 0.1)',
                    background: rentalCategory === 'BOTH' ? 'rgba(245, 158, 11, 0.25)' : '#0b111e',
                    color: rentalCategory === 'BOTH' ? '#ffffff' : '#94a3b8',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <Sparkles size={14} color={rentalCategory === 'BOTH' ? '#fbbf24' : '#94a3b8'} />
                  <span>Both (2W + 4W)</span>
                </button>
              </div>
            </div>
          )}

          {/* Basic Agency / Facility Information */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input
              type="text"
              placeholder={
                isRental 
                  ? (rentalCategory === 'TWO_WHEELER' 
                      ? 'Bike Rental Agency Name (e.g. Fort Kochi Royal Riders)' 
                      : rentalCategory === 'FOUR_WHEELER'
                      ? 'Car Rental Agency Name (e.g. Munnar Self-Drive Cars)'
                      : 'Rental Hub Name (e.g. Kochi Wheels Bike & Car Rentals)')
                  : isSports 
                  ? 'Sports Arena / Turf Name (e.g. KickOff 7s Arena Kakkanad)' 
                  : 'Parking Name (e.g. Aluva Railway Station Private Parking)'
              }
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{ background: '#0b111e', border: '1px solid var(--border-light)', borderRadius: '10px', padding: '10px 14px', fontSize: '0.85rem', color: 'white', outline: 'none' }}
            />

            <textarea
              placeholder={
                isRental 
                  ? 'Describe your rental fleet, maintenance condition, pickup hubs, fuel policy, security deposit terms...'
                  : isSports 
                  ? 'Describe turf dimensions, turf brand/quality, lighting, changing rooms, parking availability...'
                  : 'Description & Facilities (CCTV, Security, Covered, Night Lights)...'
              }
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              style={{ background: '#0b111e', border: '1px solid var(--border-light)', borderRadius: '10px', padding: '10px 14px', fontSize: '0.85rem', color: 'white', outline: 'none', resize: 'none' }}
            />
          </div>

          {/* Address & District */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '10px' }}>
            <input
              type="text"
              placeholder={isRental ? 'Shop / Hub Address (e.g. Near Boat Jetty)' : 'Address / Station Road'}
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
              <option value="Idukki">Idukki / Munnar (Tourist)</option>
              <option value="Wayanad">Wayanad (Tourist)</option>
            </select>
          </div>

          <input
            type="text"
            placeholder={
              isRental 
                ? 'Nearby Landmark / Tourist Spot (e.g. 200m from Fort Kochi Beach / Aluva Metro)' 
                : 'Nearby Landmark (e.g. 350m from Aluva Railway Station)'
            }
            value={landmark}
            onChange={(e) => setLandmark(e.target.value)}
            style={{ background: '#0b111e', border: '1px solid var(--border-light)', borderRadius: '10px', padding: '10px 14px', fontSize: '0.85rem', color: 'white', outline: 'none' }}
          />

          {/* ======================================================== */}
          {/* SECTION A: 2-WHEELER SPECIFIC FIELDS                     */}
          {/* ======================================================== */}
          {isRental && (rentalCategory === 'TWO_WHEELER' || rentalCategory === 'BOTH') && (
            <div style={{ 
              background: '#090d16', 
              padding: '14px', 
              borderRadius: '12px', 
              border: '1px solid rgba(56, 189, 248, 0.3)', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '12px' 
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Bike size={16} /> 2-Wheeler (Bikes & Scooters) Configuration
                </span>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                  Tourist & Local Rentals
                </span>
              </div>

              {/* Supported 2W Models Chips */}
              <div>
                <label style={{ fontSize: '0.7rem', color: '#cbd5e1', display: 'block', marginBottom: '6px' }}>
                  Select Available 2-Wheeler Models in Fleet:
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {[
                    'Honda Activa 6G (110cc)',
                    'Suzuki Access 125',
                    'Royal Enfield Classic 350',
                    'Royal Enfield Hunter 350',
                    'Royal Enfield Himalayan 450',
                    'Ather 450X Electric'
                  ].map(model => {
                    const isSelected = twoWheelerSelectedModels.includes(model);
                    return (
                      <button
                        key={model}
                        type="button"
                        onClick={() => toggleTwoWheelerModel(model)}
                        style={{
                          padding: '4px 8px',
                          borderRadius: '6px',
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          border: isSelected ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.1)',
                          background: isSelected ? 'rgba(56, 189, 248, 0.2)' : 'rgba(30, 41, 59, 0.4)',
                          color: isSelected ? '#38bdf8' : '#94a3b8',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        {isSelected && <Check size={10} />}
                        {model}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2W Capacity & Pricing Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.7rem', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>
                    Total Bikes Count
                  </label>
                  <input
                    type="number"
                    value={twoWheelerFleetSize}
                    onChange={(e) => setTwoWheelerFleetSize(Number(e.target.value))}
                    min={1}
                    style={{ width: '100%', background: '#0b111e', border: '1px solid var(--border-light)', borderRadius: '8px', padding: '6px 10px', fontSize: '0.8rem', color: 'white' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.7rem', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>
                    Daily Rent (₹/day)
                  </label>
                  <input
                    type="number"
                    value={twoWheelerDailyRate}
                    onChange={(e) => setTwoWheelerDailyRate(Number(e.target.value))}
                    min={100}
                    style={{ width: '100%', background: '#0b111e', border: '1px solid var(--border-light)', borderRadius: '8px', padding: '6px 10px', fontSize: '0.8rem', color: 'white' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.7rem', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>
                    Security Deposit (₹)
                  </label>
                  <input
                    type="number"
                    value={twoWheelerDeposit}
                    onChange={(e) => setTwoWheelerDeposit(Number(e.target.value))}
                    min={0}
                    style={{ width: '100%', background: '#0b111e', border: '1px solid var(--border-light)', borderRadius: '8px', padding: '6px 10px', fontSize: '0.8rem', color: 'white' }}
                  />
                </div>
              </div>

              {/* 2W Inclusions: Helmets, Free KM */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '10px', alignItems: 'center' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#cbd5e1', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={twoWheelerHelmetsIncluded}
                    onChange={(e) => setTwoWheelerHelmetsIncluded(e.target.checked)}
                    style={{ accentColor: '#38bdf8' }}
                  />
                  <span>2 Free ISI Helmets Included with every bike</span>
                </label>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <label style={{ fontSize: '0.7rem', color: '#cbd5e1', whiteSpace: 'nowrap' }}>Free KM/Day:</label>
                  <input
                    type="number"
                    value={twoWheelerFreeKm}
                    onChange={(e) => setTwoWheelerFreeKm(Number(e.target.value))}
                    style={{ width: '70px', background: '#0b111e', border: '1px solid var(--border-light)', borderRadius: '6px', padding: '4px 8px', fontSize: '0.75rem', color: 'white' }}
                  />
                  <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>km</span>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* SECTION B: 4-WHEELER SPECIFIC FIELDS                     */}
          {/* ======================================================== */}
          {isRental && (rentalCategory === 'FOUR_WHEELER' || rentalCategory === 'BOTH') && (
            <div style={{ 
              background: '#090d16', 
              padding: '14px', 
              borderRadius: '12px', 
              border: '1px solid rgba(16, 185, 129, 0.3)', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '12px' 
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#34d399', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Car size={16} /> 4-Wheeler (Cars & SUVs) Configuration
                </span>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                  Self-Drive & Chauffeur
                </span>
              </div>

              {/* Supported 4W Models Chips */}
              <div>
                <label style={{ fontSize: '0.7rem', color: '#cbd5e1', display: 'block', marginBottom: '6px' }}>
                  Select Available 4-Wheeler Segments in Fleet:
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {[
                    'Maruti Swift ZXi (Hatchback)',
                    'Hyundai i20 (Premium Hatch)',
                    'Maruti Dzire (Sedan)',
                    'Mahindra Thar 4x4 (Offroad SUV)',
                    'Toyota Innova Crysta (7-Seater)',
                    'Tata Nexon EV (Electric)'
                  ].map(model => {
                    const isSelected = fourWheelerSelectedModels.includes(model);
                    return (
                      <button
                        key={model}
                        type="button"
                        onClick={() => toggleFourWheelerModel(model)}
                        style={{
                          padding: '4px 8px',
                          borderRadius: '6px',
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          border: isSelected ? '1px solid #10b981' : '1px solid rgba(255, 255, 255, 0.1)',
                          background: isSelected ? 'rgba(16, 185, 129, 0.2)' : 'rgba(30, 41, 59, 0.4)',
                          color: isSelected ? '#34d399' : '#94a3b8',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        {isSelected && <Check size={10} />}
                        {model}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4W Capacity & Pricing Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.7rem', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>
                    Total Cars Count
                  </label>
                  <input
                    type="number"
                    value={fourWheelerFleetSize}
                    onChange={(e) => setFourWheelerFleetSize(Number(e.target.value))}
                    min={1}
                    style={{ width: '100%', background: '#0b111e', border: '1px solid var(--border-light)', borderRadius: '8px', padding: '6px 10px', fontSize: '0.8rem', color: 'white' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.7rem', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>
                    Daily Rent (₹/day)
                  </label>
                  <input
                    type="number"
                    value={fourWheelerDailyRate}
                    onChange={(e) => setFourWheelerDailyRate(Number(e.target.value))}
                    min={500}
                    style={{ width: '100%', background: '#0b111e', border: '1px solid var(--border-light)', borderRadius: '8px', padding: '6px 10px', fontSize: '0.8rem', color: 'white' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.7rem', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>
                    Security Deposit (₹)
                  </label>
                  <input
                    type="number"
                    value={fourWheelerDeposit}
                    onChange={(e) => setFourWheelerDeposit(Number(e.target.value))}
                    min={0}
                    style={{ width: '100%', background: '#0b111e', border: '1px solid var(--border-light)', borderRadius: '8px', padding: '6px 10px', fontSize: '0.8rem', color: 'white' }}
                  />
                </div>
              </div>

              {/* 4W Transmission & Chauffeur Options */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', alignItems: 'center' }}>
                <div>
                  <label style={{ fontSize: '0.7rem', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>
                    Transmission Available:
                  </label>
                  <select
                    value={fourWheelerTransmission}
                    onChange={(e) => setFourWheelerTransmission(e.target.value as any)}
                    style={{ width: '100%', background: '#0b111e', border: '1px solid var(--border-light)', borderRadius: '8px', padding: '6px 10px', fontSize: '0.75rem', color: 'white' }}
                  >
                    <option value="BOTH">Both (Manual & Automatic)</option>
                    <option value="MANUAL">Manual Only</option>
                    <option value="AUTOMATIC">Automatic Only</option>
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', paddingTop: '14px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#cbd5e1', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={fourWheelerWithDriver}
                      onChange={(e) => setFourWheelerWithDriver(e.target.checked)}
                      style={{ accentColor: '#10b981' }}
                    />
                    <span>Chauffeur / Driver service available</span>
                  </label>
                  
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#cbd5e1', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={fourWheelerFastag}
                      onChange={(e) => setFourWheelerFastag(e.target.checked)}
                      style={{ accentColor: '#10b981' }}
                    />
                    <span>Fastag & AC equipped</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* SECTION C: RENTAL COMMON (DELIVERY, UPI, PHONE)          */}
          {/* ======================================================== */}
          {isRental && (
            <div style={{ 
              background: '#090d16', 
              padding: '12px 14px', 
              borderRadius: '12px', 
              border: '1px solid rgba(255, 255, 255, 0.08)', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '10px' 
            }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Phone size={13} color="#38bdf8" /> Operational & Payment Coordination:
              </span>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.7rem', color: '#cbd5e1', display: 'block', marginBottom: '2px' }}>Contact Phone / WhatsApp</label>
                  <input
                    type="text"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    style={{ width: '100%', background: '#0b111e', border: '1px solid var(--border-light)', borderRadius: '8px', padding: '6px 10px', fontSize: '0.75rem', color: 'white' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.7rem', color: '#cbd5e1', display: 'block', marginBottom: '2px' }}>Direct UPI ID (for deposits)</label>
                  <input
                    type="text"
                    value={upiVpa}
                    onChange={(e) => setUpiVpa(e.target.value)}
                    placeholder="e.g. yourshop@okaxis"
                    style={{ width: '100%', background: '#0b111e', border: '1px solid var(--border-light)', borderRadius: '8px', padding: '6px 10px', fontSize: '0.75rem', color: 'white' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '4px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#cbd5e1', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={offersDelivery}
                    onChange={(e) => setOffersDelivery(e.target.checked)}
                    style={{ accentColor: '#38bdf8' }}
                  />
                  <span>Doorstep delivery to Hotel / Railway Station (₹{deliveryFee})</span>
                </label>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#cbd5e1' }}>
                  <span>Fuel Policy:</span>
                  <select
                    value={fuelPolicy}
                    onChange={(e) => setFuelPolicy(e.target.value as any)}
                    style={{ background: '#0b111e', border: '1px solid var(--border-light)', borderRadius: '6px', padding: '3px 8px', fontSize: '0.7rem', color: 'white' }}
                  >
                    <option value="SAME_TO_SAME">Same-to-Same</option>
                    <option value="FULL_TO_FULL">Full-to-Full</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* PARKING CONFIGURATION (Only shown for Parking) */}
          {isParking && (
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

          {/* SPORTS CONFIGURATION (Only shown for Sports Turf) */}
          {isSports && (
            <div style={{ background: '#090d16', padding: '14px', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.3)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#34d399' }}>Configure Turf / Court Slot Pricing</span>
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.7rem', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>Sport & Arena Type</label>
                  <select
                    value={turfSport}
                    onChange={(e) => setTurfSport(e.target.value)}
                    style={{ width: '100%', background: '#0b111e', border: '1px solid var(--border-light)', borderRadius: '8px', padding: '6px 10px', fontSize: '0.8rem', color: 'white' }}
                  >
                    <option value="Football (7s Turf)">Football (7s Artificial Turf)</option>
                    <option value="Football (5s Cage)">Football (5s Cage Ground)</option>
                    <option value="Badminton (Indoor Wooden)">Badminton (Indoor Wooden Court)</option>
                    <option value="Box Cricket (Floodlight)">Box Cricket (Floodlight Arena)</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.7rem', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>Hourly Rate (₹/hr)</label>
                  <input
                    type="number"
                    value={turfHourlyPrice}
                    onChange={(e) => setTurfHourlyPrice(Number(e.target.value))}
                    style={{ width: '100%', background: '#0b111e', border: '1px solid var(--border-light)', borderRadius: '8px', padding: '6px 10px', fontSize: '0.8rem', color: 'white' }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Adaptive License / Ownership Proof Document Upload */}
          <div style={{ 
            background: '#090d16', 
            padding: '12px 14px', 
            borderRadius: '12px', 
            border: '1px solid var(--border-light)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            gap: '10px' 
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={18} color={isRental ? '#38bdf8' : isSports ? '#10b981' : '#f59e0b'} />
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'white', display: 'block' }}>
                  {isRental 
                    ? (rentalCategory === 'TWO_WHEELER' 
                        ? '2-Wheeler RTO Rental Authorization / Trade License' 
                        : rentalCategory === 'FOUR_WHEELER'
                        ? 'Rent-a-Cab License / Commercial Insurance'
                        : 'Commercial Fleet Permit & License Document')
                    : isSports 
                    ? 'Sports Turf Ownership Deed or Lease Contract'
                    : 'Land Ownership Proof Document'}
                </span>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{documentName}</span>
              </div>
            </div>
            
            <button
              type="button"
              onClick={() => {
                if (isRental) {
                  if (rentalCategory === 'TWO_WHEELER') setDocumentName('Verified_Kerala_2W_Rental_Permit_2026.pdf');
                  else if (rentalCategory === 'FOUR_WHEELER') setDocumentName('Verified_Commercial_Cab_License_2026.pdf');
                  else setDocumentName('Verified_Fleet_Permit_2026.pdf');
                } else if (isSports) {
                  setDocumentName('Sports_Turf_Lease_Contract_2026.pdf');
                } else {
                  setDocumentName('Verified_Ownership_TaxReceipt_2026.pdf');
                }
              }}
              style={{ 
                padding: '6px 12px', 
                borderRadius: '8px', 
                background: isRental ? 'rgba(56, 189, 248, 0.2)' : isSports ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)', 
                border: '1px solid',
                borderColor: isRental ? 'rgba(56, 189, 248, 0.4)' : isSports ? 'rgba(16, 185, 129, 0.4)' : 'rgba(245, 158, 11, 0.4)', 
                color: isRental ? '#38bdf8' : isSports ? '#34d399' : '#fbbf24', 
                fontSize: '0.7rem', 
                fontWeight: 700, 
                cursor: 'pointer', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '4px' 
              }}
            >
              <Upload size={12} /> Upload PDF
            </button>
          </div>

          {/* Adaptive Submit Button */}
          <button
            type="submit"
            style={{ 
              width: '100%', 
              padding: '12px', 
              fontSize: '0.85rem', 
              fontWeight: 800,
              borderRadius: '12px',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              color: 'white',
              background: isRental 
                ? 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)' 
                : isSports 
                ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' 
                : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              boxShadow: isRental 
                ? '0 4px 15px rgba(2, 132, 199, 0.4)' 
                : isSports 
                ? '0 4px 15px rgba(16, 185, 129, 0.4)' 
                : '0 4px 15px rgba(245, 158, 11, 0.4)'
            }}
          >
            <Shield size={16} />
            <span>
              {isRental 
                ? (rentalCategory === 'TWO_WHEELER' 
                    ? 'SUBMIT 2-WHEELER FLEET FOR ADMIN APPROVAL' 
                    : rentalCategory === 'FOUR_WHEELER'
                    ? 'SUBMIT 4-WHEELER FLEET FOR ADMIN APPROVAL'
                    : 'SUBMIT 2W & 4W FLEET FOR ADMIN APPROVAL')
                : isSports 
                ? 'SUBMIT SPORTS ARENA FOR ADMIN APPROVAL'
                : 'SUBMIT PARKING FACILITY FOR ADMIN APPROVAL'}
            </span>
          </button>

        </form>

      </div>

    </div>
  );
};
