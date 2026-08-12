-- =============================================================================
-- LOCALBOOKING PLATFORM - SUPABASE SEED DATA SCRIPT
-- Contains initial roles, users, facility types, sports/vehicle types, and sample facilities
-- =============================================================================

-- 1. Roles
INSERT INTO roles (role_id, name, description) VALUES
(1, 'ADMIN', 'System Administrator'),
(2, 'OWNER', 'Facility Owner'),
(3, 'CUSTOMER', 'Registered Customer'),
(4, 'STAFF', 'Check-in Staff')
ON CONFLICT (role_id) DO NOTHING;

-- 2. Facility Types
INSERT INTO facility_types (facility_type_id, code, name, icon) VALUES
(1, 'SPORTS', 'Sports Arena & Turf', 'sports_soccer'),
(2, 'PARKING', 'Parking Facility', 'local_parking'),
(3, 'EV_CHARGING', 'EV Charging Station', 'ev_station')
ON CONFLICT (facility_type_id) DO NOTHING;

-- 3. Vehicle Types
INSERT INTO vehicle_types (vehicle_type_id, code, name) VALUES
(1, 'TWO_WHEELER', 'Two Wheeler / Bike'),
(2, 'CAR', 'Hatchback / Sedan Car'),
(3, 'SUV', 'SUV / Large Car'),
(4, 'VAN', 'Traveller / Van'),
(5, 'EV', 'EV Car Charging Slot')
ON CONFLICT (vehicle_type_id) DO NOTHING;

-- 4. Sports Types
INSERT INTO sports_types (sports_type_id, name, icon) VALUES
(1, 'Football', 'sports_soccer'),
(2, 'Cricket', 'sports_cricket'),
(3, 'Badminton', 'sports_tennis'),
(4, 'Pickleball', 'sports_tennis'),
(5, 'Padel', 'sports_tennis'),
(6, 'Tennis', 'sports_tennis')
ON CONFLICT (sports_type_id) DO NOTHING;

-- 5. System Users (Password for all: Password123! hashed via BCrypt)
INSERT INTO users (user_id, name, email, mobile, password_hash, user_type, status) VALUES
('11111111-1111-1111-1111-111111111111', 'System Admin', 'admin@localbooking.com', '+919876543210', '$2a$11$N.0.2p2a/V2e9L2h1C0T.O3.8V8a8i8k8m8o8q8s8u8w8y8z8', 'ADMIN', 'ACTIVE'),
('22222222-2222-2222-2222-222222222222', 'Aravind (Railway Parking Owner)', 'aravind.owner@gmail.com', '+919847012345', '$2a$11$N.0.2p2a/V2e9L2h1C0T.O3.8V8a8i8k8m8o8q8s8u8w8y8z8', 'OWNER', 'ACTIVE'),
('33333333-3333-3333-3333-333333333333', 'Kochi Sports Arena Owner', 'sports.owner@gmail.com', '+919847098765', '$2a$11$N.0.2p2a/V2e9L2h1C0T.O3.8V8a8i8k8m8o8q8s8u8w8y8z8', 'OWNER', 'ACTIVE'),
('44444444-4444-4444-4444-444444444444', 'Rahul Nair (Customer)', 'rahul.nair@gmail.com', '+919846011223', '$2a$11$N.0.2p2a/V2e9L2h1C0T.O3.8V8a8i8k8m8o8q8s8u8w8y8z8', 'CUSTOMER', 'ACTIVE')
ON CONFLICT (user_id) DO NOTHING;

-- 6. User Roles Mapping
INSERT INTO user_roles (user_id, role_id) VALUES
('11111111-1111-1111-1111-111111111111', 1),
('22222222-2222-2222-2222-222222222222', 2),
('33333333-3333-3333-3333-333333333333', 2),
('44444444-4444-4444-4444-444444444444', 3)
ON CONFLICT (user_id, role_id) DO NOTHING;

-- 7. Facilities (Kerala Sample Data)
INSERT INTO facilities 
(facility_id, owner_id, facility_type_id, name, description, address, district, state, country, postal_code, latitude, longitude, landmark, is_24_hours, opening_time, closing_time, status, approval_status, rating, review_count)
VALUES
(
    'f1111111-1111-1111-1111-111111111111',
    '22222222-2222-2222-2222-222222222222',
    2,
    'Aluva Railway Station Premium Parking',
    'Safe, 24/7 guarded private land parking located 350 meters from Aluva Railway Station & Metro. CCTV, night lighting, toilet facilities available.',
    'Station Road, Near Railway Overbridge, Aluva',
    'Ernakulam',
    'Kerala',
    'India',
    '683101',
    10.1084,
    76.3572,
    '350m from Aluva Railway Station',
    TRUE,
    '00:00:00',
    '23:59:59',
    'APPROVED',
    'APPROVED',
    4.80,
    142
),
(
    'f2222222-2222-2222-2222-222222222222',
    '22222222-2222-2222-2222-222222222222',
    2,
    'Ernakulam South Station Covered Parking',
    'Covered parking with CCTV surveillance 200m from Ernakulam South Junction station entrance.',
    'South Railway Station Road, Manorama Junction, Ernakulam',
    'Ernakulam',
    'Kerala',
    'India',
    '682016',
    9.9678,
    76.2917,
    '200m from South Railway Station',
    TRUE,
    '00:00:00',
    '23:59:59',
    'APPROVED',
    'APPROVED',
    4.60,
    98
),
(
    'f3333333-3333-3333-3333-333333333333',
    '33333333-3333-3333-3333-333333333333',
    1,
    'ABC Sports Arena Kakkanad',
    'FIFA-approved 7''s & 5''s football turf with high-lux LED floodlights, changing rooms, and cafeteria.',
    'Infopark Expressway, Near SmartCity, Kakkanad',
    'Ernakulam',
    'Kerala',
    'India',
    '682030',
    10.0159,
    76.3639,
    'Near Infopark Phase 1 Gate',
    FALSE,
    '05:00:00',
    '23:00:00',
    'APPROVED',
    'APPROVED',
    4.90,
    215
),
(
    'f4444444-4444-4444-4444-444444444444',
    '33333333-3333-3333-3333-333333333333',
    1,
    'Kochi Pickleball & Badminton Club',
    'Indoor air-conditioned badminton courts & outdoor pickleball arena in Edappally.',
    'Bypass Road, Edappally, Kochi',
    'Ernakulam',
    'Kerala',
    'India',
    '682024',
    10.0261,
    76.3089,
    '500m from Lulu Mall',
    FALSE,
    '06:00:00',
    '22:00:00',
    'APPROVED',
    'APPROVED',
    4.70,
    178
)
ON CONFLICT (facility_id) DO NOTHING;

-- 8. Parking Areas
INSERT INTO parking_areas (parking_area_id, facility_id, vehicle_type_id, total_capacity, price_per_hour, price_per_day, price_per_overnight, price_per_month) VALUES
(uuid_generate_v4(), 'f1111111-1111-1111-1111-111111111111', 1, 100, 10.00, 80.00, 100.00, 1500.00),
(uuid_generate_v4(), 'f1111111-1111-1111-1111-111111111111', 2, 30, 30.00, 200.00, 250.00, 4000.00),
(uuid_generate_v4(), 'f2222222-2222-2222-2222-222222222222', 2, 40, 35.00, 220.00, 280.00, 4500.00)
ON CONFLICT DO NOTHING;

-- 9. Sports Resources
INSERT INTO resources (resource_id, facility_id, sports_type_id, name, description, capacity, slot_duration_minutes, status) VALUES
('e1111111-1111-1111-1111-111111111111', 'f3333333-3333-3333-3333-333333333333', 1, '7''s Football Turf 1 (FIFA Turf)', 'Full size 7-a-side artificial grass ground.', 14, 60, 'ACTIVE'),
('e2222222-2222-2222-2222-222222222222', 'f3333333-3333-3333-3333-333333333333', 1, '5''s Football Turf 2', 'Fast-paced 5-a-side ground with turf shoes available for rent.', 10, 60, 'ACTIVE'),
('e3333333-3333-3333-3333-333333333333', 'f4444444-4444-4444-4444-444444444444', 3, 'Indoor Wooden Badminton Court 1', 'BWF Standard synthetic court mat over wooden floor.', 4, 60, 'ACTIVE'),
('e4444444-4444-4444-4444-444444444444', 'f4444444-4444-4444-4444-444444444444', 4, 'Pickleball Court A', 'Pro-grade acrylic surface pickleball court with paddles provided.', 4, 60, 'ACTIVE')
ON CONFLICT (resource_id) DO NOTHING;

-- 10. Pricing Rules
INSERT INTO pricing_rules (pricing_rule_id, facility_id, resource_id, pricing_model, price_per_hour, peak_hour_price) VALUES
(uuid_generate_v4(), 'f3333333-3333-3333-3333-333333333333', 'e1111111-1111-1111-1111-111111111111', 'HOURLY', 1200.00, 1600.00),
(uuid_generate_v4(), 'f4444444-4444-4444-4444-444444444444', 'e3333333-3333-3333-3333-333333333333', 'HOURLY', 400.00, 500.00)
ON CONFLICT DO NOTHING;

-- 11. Initial Sample Active Coupon
INSERT INTO coupons (coupon_id, code, discount_type, discount_value, max_discount_amount, min_booking_amount, valid_from, valid_to, usage_limit, user_usage_limit, status) VALUES
(uuid_generate_v4(), 'FIRSTBOOK', 'PERCENTAGE', 10.00, 100.00, 200.00, CURRENT_TIMESTAMP - INTERVAL '10 days', CURRENT_TIMESTAMP + INTERVAL '180 days', 500, 1, 'ACTIVE')
ON CONFLICT (code) DO NOTHING;
