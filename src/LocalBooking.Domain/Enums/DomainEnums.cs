namespace LocalBooking.Domain.Enums;

public enum UserType
{
    CUSTOMER,
    OWNER,
    STAFF,
    ADMIN
}

public enum UserStatus
{
    ACTIVE,
    SUSPENDED,
    INACTIVE
}

public enum FacilityStatusCode
{
    DRAFT,
    PENDING_REVIEW,
    APPROVED,
    REJECTED,
    SUSPENDED
}

public enum BookingStatusCode
{
    PENDING,
    PAYMENT_PENDING,
    CONFIRMED,
    CHECKED_IN,
    COMPLETED,
    CANCELLED,
    REFUND_PENDING,
    REFUNDED,
    NO_SHOW,
    EXPIRED,
    ON_RENT,   // rental: vehicle handed over
    OVERDUE,   // rental: past scheduled return + grace
    RETURNED   // rental: vehicle back, awaiting settlement
}

public enum PaymentStatusCode
{
    PENDING,
    AUTHORIZED,
    PAID,
    FAILED,
    REFUND_PENDING,
    PARTIALLY_REFUNDED,
    REFUNDED
}

public enum PricingModelCode
{
    HOURLY,
    DAILY,
    OVERNIGHT,
    MONTHLY
}

public enum DiscountType
{
    PERCENTAGE,
    FIXED
}

public enum SettlementStatusCode
{
    PENDING,
    PROCESSING,
    PAID,
    FAILED
}

public enum DocumentType
{
    GOVT_ID,
    LAND_PROOF,
    BANK_PROOF,
    AUTHORIZATION,
    DRIVING_LICENCE,
    AADHAAR,
    PASSPORT,
    RC_BOOK,
    INSURANCE
}

public enum VerificationStatus
{
    PENDING,
    APPROVED,
    REJECTED
}

// ---------- Vehicle Rentals ----------

public enum VehicleCategory { SCOOTER, BIKE, HATCHBACK, SEDAN, SUV, MUV }

public enum FuelType { PETROL, DIESEL, EV, CNG }

public enum TransmissionType { MANUAL, AUTOMATIC }

public enum VehicleStatus { AVAILABLE, ON_RENT, MAINTENANCE, INACTIVE }

public enum FuelPolicy { SAME_TO_SAME, FULL_TO_FULL, INCLUDED }

public enum DriverStatus { AVAILABLE, ON_DUTY, OFF }

public enum MaintenanceType { SERVICE, REPAIR, TYRE, INSURANCE_RENEWAL, OTHER }

public enum HandoverMode { AT_SHOP, DELIVERY }

public enum InspectionStage { PICKUP, RETURN }

public enum RentalChargeType { EXTRA_KM, LATE_RETURN, FUEL, DAMAGE, CLEANING, DRIVER_NIGHT, DELIVERY, OTHER }

public enum DepositStatus { PENDING, HELD, PARTIALLY_REFUNDED, REFUNDED, FORFEITED }

public enum BookingSource { ONLINE, WALK_IN }

public enum PaymentPurpose { RENT, DEPOSIT, EXTRA_CHARGES, DRIVER_FEE, DELIVERY_FEE, BOOKING }
