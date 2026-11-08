-- =============================================================================
-- LOCALBOOKING PLATFORM - SUPABASE POSTGRESQL SCHEMA SCRIPT
-- Compatible with EF Core Npgsql Snake Case Naming Conventions
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Roles Table
CREATE TABLE IF NOT EXISTS roles (
    role_id INT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255)
);

-- 2. Users Table
CREATE TABLE IF NOT EXISTS users (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    mobile VARCHAR(20) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    user_type VARCHAR(20) NOT NULL DEFAULT 'CUSTOMER',
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMPTZ
);

-- 3. User Roles (Junction Table)
CREATE TABLE IF NOT EXISTS user_roles (
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    role_id INT NOT NULL REFERENCES roles(role_id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

-- 4. Facility Types
CREATE TABLE IF NOT EXISTS facility_types (
    facility_type_id INT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(50)
);

-- 5. Vehicle Types
CREATE TABLE IF NOT EXISTS vehicle_types (
    vehicle_type_id INT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL
);

-- 6. Sports Types
CREATE TABLE IF NOT EXISTS sports_types (
    sports_type_id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    icon VARCHAR(50)
);

-- 7. Features
CREATE TABLE IF NOT EXISTS features (
    feature_id INT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(50)
);

-- 8. Facilities Table
CREATE TABLE IF NOT EXISTS facilities (
    facility_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    facility_type_id INT NOT NULL REFERENCES facility_types(facility_type_id),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    address VARCHAR(300) NOT NULL,
    district VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL DEFAULT 'Kerala',
    country VARCHAR(100) NOT NULL DEFAULT 'India',
    postal_code VARCHAR(20) NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    landmark VARCHAR(200),
    is_24_hours BOOLEAN NOT NULL DEFAULT FALSE,
    opening_time TIME,
    closing_time TIME,
    status VARCHAR(30) NOT NULL DEFAULT 'APPROVED',
    approval_status VARCHAR(30) NOT NULL DEFAULT 'APPROVED',
    commission_rate NUMERIC(5,2) DEFAULT 10.00,
    rating NUMERIC(3,2) DEFAULT 4.8,
    review_count INT DEFAULT 0,
    created_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 9. Facility Photos
CREATE TABLE IF NOT EXISTS facility_photos (
    facility_photo_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    facility_id UUID NOT NULL REFERENCES facilities(facility_id) ON DELETE CASCADE,
    photo_url TEXT NOT NULL,
    display_order INT DEFAULT 0
);

-- 10. Facility Features (Junction Table)
CREATE TABLE IF NOT EXISTS facility_features (
    facility_id UUID NOT NULL REFERENCES facilities(facility_id) ON DELETE CASCADE,
    feature_id INT NOT NULL REFERENCES features(feature_id) ON DELETE CASCADE,
    PRIMARY KEY (facility_id, feature_id)
);

-- 11. Parking Areas
CREATE TABLE IF NOT EXISTS parking_areas (
    parking_area_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    facility_id UUID NOT NULL REFERENCES facilities(facility_id) ON DELETE CASCADE,
    vehicle_type_id INT NOT NULL REFERENCES vehicle_types(vehicle_type_id),
    total_capacity INT NOT NULL DEFAULT 10,
    price_per_hour NUMERIC(18,2) NOT NULL DEFAULT 0.00,
    price_per_day NUMERIC(18,2) NOT NULL DEFAULT 0.00,
    price_per_overnight NUMERIC(18,2) NOT NULL DEFAULT 0.00,
    price_per_month NUMERIC(18,2) NOT NULL DEFAULT 0.00,
    CONSTRAINT unique_facility_vehicle_type UNIQUE (facility_id, vehicle_type_id)
);

-- 12. Resources (Sports Grounds / Turfs / Courts)
CREATE TABLE IF NOT EXISTS resources (
    resource_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    facility_id UUID NOT NULL REFERENCES facilities(facility_id) ON DELETE CASCADE,
    sports_type_id INT REFERENCES sports_types(sports_type_id),
    name VARCHAR(150) NOT NULL,
    description TEXT,
    capacity INT DEFAULT 10,
    slot_duration_minutes INT DEFAULT 60,
    status VARCHAR(30) DEFAULT 'ACTIVE'
);

-- 13. Pricing Rules
CREATE TABLE IF NOT EXISTS pricing_rules (
    pricing_rule_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    facility_id UUID NOT NULL REFERENCES facilities(facility_id) ON DELETE CASCADE,
    resource_id UUID REFERENCES resources(resource_id) ON DELETE CASCADE,
    pricing_model VARCHAR(30) DEFAULT 'HOURLY',
    price_per_hour NUMERIC(18,2) NOT NULL DEFAULT 0.00,
    peak_hour_price NUMERIC(18,2) DEFAULT 0.00
);

-- 14. Coupons Table
CREATE TABLE IF NOT EXISTS coupons (
    coupon_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) NOT NULL UNIQUE,
    discount_type VARCHAR(30) NOT NULL DEFAULT 'PERCENTAGE',
    discount_value NUMERIC(18,2) NOT NULL,
    max_discount_amount NUMERIC(18,2),
    min_booking_amount NUMERIC(18,2) DEFAULT 0.00,
    valid_from TIMESTAMPTZ NOT NULL,
    valid_to TIMESTAMPTZ NOT NULL,
    usage_limit INT DEFAULT 100,
    user_usage_limit INT DEFAULT 1,
    status VARCHAR(30) DEFAULT 'ACTIVE'
);

-- 15. Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
    booking_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_number VARCHAR(50) NOT NULL UNIQUE,
    user_id UUID NOT NULL REFERENCES users(user_id),
    facility_id UUID NOT NULL REFERENCES facilities(facility_id),
    booking_type VARCHAR(30) NOT NULL,
    start_date_time TIMESTAMPTZ NOT NULL,
    end_date_time TIMESTAMPTZ NOT NULL,
    booking_status VARCHAR(30) NOT NULL DEFAULT 'CONFIRMED',
    payment_status VARCHAR(30) NOT NULL DEFAULT 'PAID',
    base_amount NUMERIC(18,2) NOT NULL DEFAULT 0.00,
    tax_amount NUMERIC(18,2) NOT NULL DEFAULT 0.00,
    platform_fee NUMERIC(18,2) NOT NULL DEFAULT 0.00,
    discount_amount NUMERIC(18,2) NOT NULL DEFAULT 0.00,
    total_amount NUMERIC(18,2) NOT NULL DEFAULT 0.00,
    currency VARCHAR(10) DEFAULT 'INR',
    qr_code_token VARCHAR(100) UNIQUE,
    created_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 16. Booking Items Table
CREATE TABLE IF NOT EXISTS booking_items (
    booking_item_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES bookings(booking_id) ON DELETE CASCADE,
    resource_id UUID REFERENCES resources(resource_id),
    parking_area_id UUID REFERENCES parking_areas(parking_area_id),
    vehicle_type_id INT REFERENCES vehicle_types(vehicle_type_id),
    vehicle_number VARCHAR(30),
    quantity INT DEFAULT 1,
    unit_price NUMERIC(18,2) DEFAULT 0.00,
    total_price NUMERIC(18,2) DEFAULT 0.00
);

-- 17. Booking Check Ins Table
CREATE TABLE IF NOT EXISTS booking_check_ins (
    booking_check_in_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES bookings(booking_id) ON DELETE CASCADE,
    checked_in_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    checked_out_at TIMESTAMPTZ,
    checked_in_by_user_id UUID REFERENCES users(user_id)
);

-- 18. Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
    review_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    facility_id UUID NOT NULL REFERENCES facilities(facility_id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(user_id),
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for optimal querying
CREATE INDEX IF NOT EXISTS idx_facilities_coords ON facilities(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_facilities_type_status ON facilities(facility_type_id, status, approval_status);
CREATE INDEX IF NOT EXISTS idx_bookings_lookup ON bookings(facility_id, start_date_time, end_date_time, booking_status);

-- =============================================================================
-- VEHICLE RENTALS (BIKE & CAR RENTALS MODULE)
-- =============================================================================

-- Add rental settings columns to facilities
ALTER TABLE facilities ADD COLUMN IF NOT EXISTS upi_vpa VARCHAR(100);
ALTER TABLE facilities ADD COLUMN IF NOT EXISTS upi_payee_name VARCHAR(150);
ALTER TABLE facilities ADD COLUMN IF NOT EXISTS accepts_direct_upi BOOLEAN DEFAULT true;
ALTER TABLE facilities ADD COLUMN IF NOT EXISTS accepts_razorpay BOOLEAN DEFAULT false;
ALTER TABLE facilities ADD COLUMN IF NOT EXISTS accepts_cash BOOLEAN DEFAULT true;
ALTER TABLE facilities ADD COLUMN IF NOT EXISTS offers_driver BOOLEAN DEFAULT false;
ALTER TABLE facilities ADD COLUMN IF NOT EXISTS offers_delivery BOOLEAN DEFAULT false;
ALTER TABLE facilities ADD COLUMN IF NOT EXISTS delivery_radius_km NUMERIC(5,2);
ALTER TABLE facilities ADD COLUMN IF NOT EXISTS delivery_fee_flat NUMERIC(10,2) DEFAULT 0.00;
ALTER TABLE facilities ADD COLUMN IF NOT EXISTS delivery_fee_per_km NUMERIC(10,2) DEFAULT 0.00;
ALTER TABLE facilities ADD COLUMN IF NOT EXISTS rental_terms TEXT;
ALTER TABLE facilities ADD COLUMN IF NOT EXISTS cancellation_policy TEXT;
ALTER TABLE facilities ADD COLUMN IF NOT EXISTS contact_phone VARCHAR(30);

-- Add source & creator to bookings
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS source VARCHAR(20) DEFAULT 'ONLINE';
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS created_by_user_id UUID REFERENCES users(user_id);
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS notes TEXT;

-- 19. Vehicle Models (Catalogue)
CREATE TABLE IF NOT EXISTS vehicle_models (
    vehicle_model_id INT PRIMARY KEY,
    category VARCHAR(30) NOT NULL,
    make VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    seats INT NOT NULL DEFAULT 2,
    fuel_type VARCHAR(20) NOT NULL DEFAULT 'PETROL',
    transmission VARCHAR(20) NOT NULL DEFAULT 'MANUAL',
    engine_cc INT
);

-- 20. Rental Plans
CREATE TABLE IF NOT EXISTS rental_plans (
    rental_plan_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    facility_id UUID NOT NULL REFERENCES facilities(facility_id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    price_per_hour NUMERIC(10,2),
    price_per_day NUMERIC(10,2) NOT NULL,
    price_per_week NUMERIC(10,2),
    min_hours INT NOT NULL DEFAULT 4,
    free_km_per_day INT,
    extra_km_charge NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    late_fee_per_hour NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    grace_minutes INT NOT NULL DEFAULT 30,
    security_deposit_amount NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    helmet_included BOOLEAN NOT NULL DEFAULT true,
    fuel_policy VARCHAR(30) NOT NULL DEFAULT 'SAME_TO_SAME',
    is_active BOOLEAN NOT NULL DEFAULT true
);

-- 21. Specific Vehicles
CREATE TABLE IF NOT EXISTS vehicles (
    vehicle_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    facility_id UUID NOT NULL REFERENCES facilities(facility_id) ON DELETE CASCADE,
    vehicle_model_id INT NOT NULL REFERENCES vehicle_models(vehicle_model_id),
    rental_plan_id UUID NOT NULL REFERENCES rental_plans(rental_plan_id),
    registration_number VARCHAR(30) NOT NULL UNIQUE,
    color VARCHAR(50),
    year INT,
    description TEXT,
    odometer_km INT NOT NULL DEFAULT 0,
    fuel_level_percent INT NOT NULL DEFAULT 100,
    status VARCHAR(30) NOT NULL DEFAULT 'AVAILABLE',
    insurance_expiry TIMESTAMPTZ,
    pollution_expiry TIMESTAMPTZ,
    permit_expiry TIMESTAMPTZ,
    is_listed_online BOOLEAN NOT NULL DEFAULT true,
    created_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_vehicles_facility_status ON vehicles(facility_id, status);

-- 22. Vehicle Photos
CREATE TABLE IF NOT EXISTS vehicle_photos (
    vehicle_photo_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID NOT NULL REFERENCES vehicles(vehicle_id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    is_primary BOOLEAN NOT NULL DEFAULT false,
    display_order INT NOT NULL DEFAULT 0
);

-- 23. Drivers
CREATE TABLE IF NOT EXISTS drivers (
    driver_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    facility_id UUID NOT NULL REFERENCES facilities(facility_id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    licence_number VARCHAR(100),
    licence_expiry TIMESTAMPTZ,
    languages VARCHAR(255),
    charge_per_day NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    night_allowance NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    status VARCHAR(30) NOT NULL DEFAULT 'AVAILABLE',
    photo_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true
);

-- 24. Renter Profiles
CREATE TABLE IF NOT EXISTS renter_profiles (
    renter_profile_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(user_id) ON DELETE SET NULL,
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(30) NOT NULL UNIQUE,
    alternate_phone VARCHAR(30),
    email VARCHAR(150),
    nationality VARCHAR(50) DEFAULT 'Indian',
    home_address TEXT,
    local_stay_address TEXT,
    created_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 25. Shop Renter Flags (Private Shop Blacklist)
CREATE TABLE IF NOT EXISTS shop_renter_flags (
    facility_id UUID NOT NULL REFERENCES facilities(facility_id) ON DELETE CASCADE,
    renter_profile_id UUID NOT NULL REFERENCES renter_profiles(renter_profile_id) ON DELETE CASCADE,
    is_blacklisted BOOLEAN NOT NULL DEFAULT false,
    reason TEXT,
    notes TEXT,
    updated_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (facility_id, renter_profile_id)
);

-- 26. Rental Agreements
CREATE TABLE IF NOT EXISTS rental_agreements (
    rental_agreement_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL UNIQUE REFERENCES bookings(booking_id) ON DELETE CASCADE,
    vehicle_id UUID NOT NULL REFERENCES vehicles(vehicle_id),
    renter_profile_id UUID NOT NULL REFERENCES renter_profiles(renter_profile_id),
    with_driver BOOLEAN NOT NULL DEFAULT false,
    driver_id UUID REFERENCES drivers(driver_id) ON DELETE SET NULL,
    pickup_mode VARCHAR(30) NOT NULL DEFAULT 'AT_SHOP',
    pickup_address TEXT,
    drop_mode VARCHAR(30) NOT NULL DEFAULT 'AT_SHOP',
    drop_address TEXT,
    delivery_distance_km NUMERIC(5,2),
    scheduled_pickup TIMESTAMPTZ NOT NULL,
    scheduled_return TIMESTAMPTZ NOT NULL,
    actual_pickup TIMESTAMPTZ,
    actual_return TIMESTAMPTZ,
    start_odometer INT,
    end_odometer INT,
    start_fuel_percent INT,
    end_fuel_percent INT,
    helmets_given INT DEFAULT 1,
    plan_snapshot_json JSONB DEFAULT '{}',
    rent_amount NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    driver_amount NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    delivery_amount NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    agreement_accepted_at TIMESTAMPTZ,
    signature_image_url TEXT
);

CREATE INDEX IF NOT EXISTS idx_agreements_vehicle_dates ON rental_agreements(vehicle_id, scheduled_pickup, scheduled_return);

-- 27. Security Deposits
CREATE TABLE IF NOT EXISTS security_deposits (
    security_deposit_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rental_agreement_id UUID NOT NULL UNIQUE REFERENCES rental_agreements(rental_agreement_id) ON DELETE CASCADE,
    amount NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    collected_via VARCHAR(20) DEFAULT 'UPI',
    collected_at TIMESTAMPTZ,
    deducted_amount NUMERIC(10,2) DEFAULT 0.00,
    refunded_amount NUMERIC(10,2) DEFAULT 0.00,
    refunded_via VARCHAR(20),
    refunded_at TIMESTAMPTZ,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING'
);

-- 28. Vehicle Inspections
CREATE TABLE IF NOT EXISTS vehicle_inspections (
    inspection_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rental_agreement_id UUID NOT NULL REFERENCES rental_agreements(rental_agreement_id) ON DELETE CASCADE,
    stage VARCHAR(20) NOT NULL,
    odometer_km INT NOT NULL,
    fuel_level_percent INT NOT NULL,
    damage_notes TEXT,
    photo_urls TEXT[] DEFAULT '{}',
    inspected_by_user_id UUID NOT NULL REFERENCES users(user_id),
    inspected_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 29. Rental Charges
CREATE TABLE IF NOT EXISTS rental_charges (
    rental_charge_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rental_agreement_id UUID NOT NULL REFERENCES rental_agreements(rental_agreement_id) ON DELETE CASCADE,
    type VARCHAR(30) NOT NULL,
    description TEXT NOT NULL,
    amount NUMERIC(10,2) NOT NULL,
    created_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

