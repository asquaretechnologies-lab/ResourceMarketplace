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
    EXPIRED
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
    AUTHORIZATION
}

public enum VerificationStatus
{
    PENDING,
    APPROVED,
    REJECTED
}
