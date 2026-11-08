import React, { useState, useEffect } from 'react';
import { Facility } from '../types';
import { searchFacilities } from '../services/api';
import { Search, MapPin, Star, Car, Activity, Clock, CheckCircle, ArrowRight } from 'lucide-react';

interface CustomerSearchPageProps {
  activeCategory: 'ALL' | 'SPORTS' | 'PARKING' | 'RENTAL';
  onSelectFacility: (facility: Facility) => void;
}

export const CustomerSearchPage: React.FC<CustomerSearchPageProps> = ({
  activeCategory,
  onSelectFacility
}) => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [district, setDistrict] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [activeCategory, district]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    const catFilter = activeCategory === 'ALL' ? undefined : activeCategory;
    try {
      const data = await searchFacilities({
        keyword: searchKeyword,
        facilityType: catFilter,
        district: district || undefined
      });
      setFacilities(data);
    } catch (err) {
      setFacilities([]);
      setError(err instanceof Error ? err.message : 'Failed to load facilities.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchData();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Hero Section */}
      <section className="hero-card">
        <div className="hero-badge">
          <Activity size={14} />
          <span>Kerala's Generic Resource Booking Engine</span>
        </div>

        <h1 className="hero-title">
          Find, Book & Ride in <span className="highlight">Kerala</span>
        </h1>
        
        <p className="hero-subtitle">
          Rent self-drive <strong>tourist bikes & cars</strong> in Fort Kochi & Munnar, reserve station parking near <strong>Aluva Railway Station</strong>, or book premier FIFA football turfs.
        </p>

        {/* Search Bar Form */}
        <form onSubmit={handleSearchSubmit} className="search-form-box">
          <div className="search-input-group">
            <Search size={18} color="#94a3b8" />
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="Search station, turf, court, area (e.g. Aluva Station, Kakkanad)..."
            />
          </div>

          <div className="search-input-group" style={{ maxWidth: '200px' }}>
            <MapPin size={18} color="#10b981" />
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
            >
              <option value="">All Districts</option>
              <option value="Ernakulam">Ernakulam / Kochi</option>
              <option value="Thrissur">Thrissur</option>
              <option value="Trivandrum">Thiruvananthapuram</option>
            </select>
          </div>

          <button type="submit" className="btn-search">
            Search
          </button>
        </form>

        {/* Quick Tag Recommendations */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', marginTop: '20px', fontSize: '12px' }}>
          <span style={{ color: '#64748b', fontWeight: 600 }}>Quick Search:</span>
          {['Aluva Station', 'Ernakulam South', 'Football Kakkanad', 'Badminton Edappally'].map((tag) => (
            <button
              key={tag}
              onClick={() => { setSearchKeyword(tag); fetchData(); }}
              style={{ background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#cbd5e1', padding: '4px 10px', borderRadius: '8px', cursor: 'pointer', fontSize: '11px' }}
            >
              {tag}
            </button>
          ))}
        </div>
      </section>

      {/* Facilities Section Header */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Available Resources</h2>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Real-time server calculated capacity & slot availability</p>
          </div>
          <div style={{ background: '#1e293b', color: '#cbd5e1', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>
            {facilities.length} Places Available
          </div>
        </div>

        {error && (
          <div role="alert" style={{ padding: '14px 18px', marginBottom: '20px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#fca5a5', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
            <span>{error}</span>
            <button id="retry-facility-search" className="btn-secondary" onClick={fetchData}>Retry</button>
          </div>
        )}
        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>
            Loading facilities & availability...
          </div>
        ) : facilities.length === 0 ? (
          <div className="hero-card" style={{ padding: '40px' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>No facilities match your search criteria</h3>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Try searching for "Aluva Railway Station" or "Kakkanad"</p>
          </div>
        ) : (
          <div className="facility-grid">
            {facilities.map((facility) => {
              const isParking = facility.facilityType === 'PARKING';
              const primaryPhoto = facility.photos[0] || (isParking 
                ? 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=800&q=80' 
                : 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&w=800&q=80');

              return (
                <div key={facility.facilityId} className="facility-card">
                  <div>
                    {/* Top Image Banner */}
                    <div className="card-image-wrap">
                      <img src={primaryPhoto} alt={facility.name} />
                      <div className="card-overlay" />

                      <div className={`badge-tag ${isParking ? 'parking' : 'sports'}`}>
                        {isParking ? <Car size={12} /> : <Activity size={12} />}
                        {isParking ? 'PARKING FACILITY' : 'SPORTS ARENA'}
                      </div>

                      <div className="rating-badge">
                        <Star size={12} fill="#fbbf24" />
                        <span>{facility.rating}</span>
                        <span style={{ color: '#94a3b8', fontWeight: 400 }}>({facility.reviewCount})</span>
                      </div>

                      <div className="distance-pill">
                        <MapPin size={12} />
                        <span>{facility.landmark || `${facility.distanceKm} km nearby`}</span>
                      </div>
                    </div>

                    {/* Content Details */}
                    <div className="card-content">
                      <h3 className="card-title">{facility.name}</h3>
                      <p className="card-desc">{facility.description}</p>

                      {/* Feature Badges */}
                      <div className="features-wrap">
                        {facility.features.map((feat, idx) => (
                          <span key={idx} className="feature-pill">
                            <CheckCircle size={10} color="#10b981" />
                            {feat}
                          </span>
                        ))}
                      </div>

                      {/* Real-time Availability Box */}
                      {isParking && facility.parkingAreas.length > 0 && (
                        <div className="availability-box" style={{ borderColor: 'rgba(245, 158, 11, 0.25)', background: 'rgba(245, 158, 11, 0.05)' }}>
                          {facility.parkingAreas.map((pa) => (
                            <div key={pa.parkingAreaId} className="avail-row">
                              <span className="name">{pa.vehicleTypeName}</span>
                              <span className="slots">{pa.availableCapacity} / {pa.totalCapacity} Slots Left</span>
                              <span className="price">₹{pa.pricePerHour}/hr</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {!isParking && facility.resources.length > 0 && (
                        <div className="availability-box" style={{ borderColor: 'rgba(16, 185, 129, 0.25)', background: 'rgba(16, 185, 129, 0.05)' }}>
                          {facility.resources.map((r) => (
                            <div key={r.resourceId} className="avail-row">
                              <span className="name">{r.name}</span>
                              <span style={{ color: '#34d399', fontWeight: 600 }}>Available Today</span>
                              <span className="price">₹{r.pricePerHour}/hr</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Action Footer */}
                  <div className="card-footer">
                    <div className="hours-text">
                      <Clock size={12} />
                      <span>{facility.is24Hours ? 'Open 24 Hours' : `${facility.openingTime} - ${facility.closingTime}`}</span>
                    </div>

                    <button
                      onClick={() => onSelectFacility(facility)}
                      className={`btn-book-now ${isParking ? 'parking' : 'sports'}`}
                    >
                      <span>BOOK NOW</span>
                      <ArrowRight size={12} />
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
