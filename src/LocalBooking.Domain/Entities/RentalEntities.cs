using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using LocalBooking.Domain.Enums;

namespace LocalBooking.Domain.Entities;

/// <summary>Shared catalogue of vehicle makes/models (e.g. Honda Activa 6G, Maruti Swift).</summary>
public class VehicleModel
{
    [Key]
    public int VehicleModelId { get; set; }
    public VehicleCategory Category { get; set; }
    public string Make { get; set; } = string.Empty;   // Honda, Royal Enfield, Maruti
    public string Model { get; set; } = string.Empty;  // Activa 6G, Classic 350, Swift
    public int Seats { get; set; } = 2;
    public FuelType FuelType { get; set; } = FuelType.PETROL;
    public TransmissionType Transmission { get; set; } = TransmissionType.MANUAL;
    public int? EngineCc { get; set; }

    public ICollection<Vehicle> Vehicles { get; set; } = new List<Vehicle>();
}

/// <summary>A pricing plan defined by a rental shop and applied to one or more vehicles.</summary>
public class RentalPlan
{
    [Key]
    public Guid RentalPlanId { get; set; } = Guid.NewGuid();
    public Guid FacilityId { get; set; }
    public Facility Facility { get; set; } = null!;

    public string Name { get; set; } = string.Empty; // e.g. "Scooter Standard"
    public decimal? PricePerHour { get; set; }
    public decimal PricePerDay { get; set; }
    public decimal? PricePerWeek { get; set; }
    public int MinHours { get; set; } = 4;

    public int? FreeKmPerDay { get; set; }          // null = unlimited km
    public decimal ExtraKmCharge { get; set; }
    public decimal LateFeePerHour { get; set; }
    public int GraceMinutes { get; set; } = 30;
    public decimal SecurityDepositAmount { get; set; }
    public bool HelmetIncluded { get; set; } = true;
    public FuelPolicy FuelPolicy { get; set; } = FuelPolicy.SAME_TO_SAME;
    public bool IsActive { get; set; } = true;

    public ICollection<Vehicle> Vehicles { get; set; } = new List<Vehicle>();
}

/// <summary>A specific physical bike/car listed by the owner and bookable by tourists.</summary>
public class Vehicle
{
    [Key]
    public Guid VehicleId { get; set; } = Guid.NewGuid();
    public Guid FacilityId { get; set; }
    public Facility Facility { get; set; } = null!;

    public int VehicleModelId { get; set; }
    public VehicleModel VehicleModel { get; set; } = null!;

    public Guid RentalPlanId { get; set; }
    public RentalPlan RentalPlan { get; set; } = null!;

    public string RegistrationNumber { get; set; } = string.Empty; // KL 07 AB 1234 (normalised, unique)
    public string Color { get; set; } = string.Empty;
    public int? Year { get; set; }
    public string Description { get; set; } = string.Empty;
    public int OdometerKm { get; set; }
    public int FuelLevelPercent { get; set; } = 100;
    public VehicleStatus Status { get; set; } = VehicleStatus.AVAILABLE;

    public DateTime? InsuranceExpiry { get; set; }
    public DateTime? PollutionExpiry { get; set; }
    public DateTime? PermitExpiry { get; set; }

    public bool IsListedOnline { get; set; } = true; // owner can keep a vehicle walk-in only
    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedDate { get; set; } = DateTime.UtcNow;

    public ICollection<VehiclePhoto> Photos { get; set; } = new List<VehiclePhoto>();
    public ICollection<VehicleMaintenance> MaintenanceRecords { get; set; } = new List<VehicleMaintenance>();
    public ICollection<RentalAgreement> RentalAgreements { get; set; } = new List<RentalAgreement>();
}

public class VehiclePhoto
{
    [Key]
    public Guid VehiclePhotoId { get; set; } = Guid.NewGuid();
    public Guid VehicleId { get; set; }
    public Vehicle Vehicle { get; set; } = null!;
    public string ImageUrl { get; set; } = string.Empty;
    public bool IsPrimary { get; set; }
    public int DisplayOrder { get; set; }
}

public class VehicleMaintenance
{
    [Key]
    public Guid MaintenanceId { get; set; } = Guid.NewGuid();
    public Guid VehicleId { get; set; }
    public Vehicle Vehicle { get; set; } = null!;
    public MaintenanceType Type { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; } // null = still in workshop (blocks bookings)
    public decimal Cost { get; set; }
    public string Notes { get; set; } = string.Empty;
}

/// <summary>Driver employed by a shop that offers "with driver" rentals.</summary>
public class Driver
{
    [Key]
    public Guid DriverId { get; set; } = Guid.NewGuid();
    public Guid FacilityId { get; set; }
    public Facility Facility { get; set; } = null!;

    public string Name { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string LicenceNumber { get; set; } = string.Empty;
    public DateTime? LicenceExpiry { get; set; }
    public string Languages { get; set; } = string.Empty; // "Malayalam, English, Hindi"
    public decimal ChargePerDay { get; set; }
    public decimal NightAllowance { get; set; }
    public DriverStatus Status { get; set; } = DriverStatus.AVAILABLE;
    public string PhotoUrl { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
}

/// <summary>A renter (tourist or walk-in). Identified by phone; optionally linked to a registered user.</summary>
public class RenterProfile
{
    [Key]
    public Guid RenterProfileId { get; set; } = Guid.NewGuid();
    public Guid? UserId { get; set; }
    public User? User { get; set; }

    public string FullName { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty; // unique, E.164-ish normalised
    public string AlternatePhone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Nationality { get; set; } = "Indian";
    public string HomeAddress { get; set; } = string.Empty;
    public string LocalStayAddress { get; set; } = string.Empty; // hotel / homestay
    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;

    public ICollection<RenterDocument> Documents { get; set; } = new List<RenterDocument>();
    public ICollection<ShopRenterFlag> ShopFlags { get; set; } = new List<ShopRenterFlag>();
}

/// <summary>Driving licence / ID proof. Images must live in a PRIVATE storage bucket (signed URLs only).</summary>
public class RenterDocument
{
    [Key]
    public Guid RenterDocumentId { get; set; } = Guid.NewGuid();
    public Guid RenterProfileId { get; set; }
    public RenterProfile RenterProfile { get; set; } = null!;

    public DocumentType DocumentType { get; set; }
    public string DocumentNumber { get; set; } = string.Empty;
    public string FrontImageUrl { get; set; } = string.Empty;
    public string BackImageUrl { get; set; } = string.Empty;
    public DateTime? ExpiryDate { get; set; }
    public VerificationStatus VerificationStatus { get; set; } = VerificationStatus.PENDING;
    public Guid? VerifiedByUserId { get; set; }
    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
}

/// <summary>Per-shop private notes/blacklist about a renter (not shared across shops).</summary>
public class ShopRenterFlag
{
    public Guid FacilityId { get; set; }
    public Facility Facility { get; set; } = null!;
    public Guid RenterProfileId { get; set; }
    public RenterProfile RenterProfile { get; set; } = null!;

    public bool IsBlacklisted { get; set; }
    public string Reason { get; set; } = string.Empty;
    public string Notes { get; set; } = string.Empty;
    public DateTime UpdatedDate { get; set; } = DateTime.UtcNow;
}

/// <summary>Rental-specific details for a Booking of type RENTAL.</summary>
public class RentalAgreement
{
    [Key]
    public Guid RentalAgreementId { get; set; } = Guid.NewGuid();
    public Guid BookingId { get; set; }
    public Booking Booking { get; set; } = null!;

    public Guid VehicleId { get; set; }
    public Vehicle Vehicle { get; set; } = null!;

    public Guid RenterProfileId { get; set; }
    public RenterProfile RenterProfile { get; set; } = null!;

    public bool WithDriver { get; set; }
    public Guid? DriverId { get; set; }
    public Driver? Driver { get; set; }

    public HandoverMode PickupMode { get; set; } = HandoverMode.AT_SHOP;
    public string PickupAddress { get; set; } = string.Empty;
    public HandoverMode DropMode { get; set; } = HandoverMode.AT_SHOP;
    public string DropAddress { get; set; } = string.Empty;
    public decimal? DeliveryDistanceKm { get; set; }

    public DateTime ScheduledPickup { get; set; }
    public DateTime ScheduledReturn { get; set; }
    public DateTime? ActualPickup { get; set; }
    public DateTime? ActualReturn { get; set; }

    public int? StartOdometer { get; set; }
    public int? EndOdometer { get; set; }
    public int? StartFuelPercent { get; set; }
    public int? EndFuelPercent { get; set; }
    public int HelmetsGiven { get; set; }

    /// <summary>JSON snapshot of the RentalPlan at booking time so later price edits don't change this bill.</summary>
    public string PlanSnapshotJson { get; set; } = "{}";

    public decimal RentAmount { get; set; }
    public decimal DriverAmount { get; set; }
    public decimal DeliveryAmount { get; set; }

    public DateTime? AgreementAcceptedAt { get; set; }
    public string SignatureImageUrl { get; set; } = string.Empty;

    public ICollection<VehicleInspection> Inspections { get; set; } = new List<VehicleInspection>();
    public ICollection<RentalCharge> Charges { get; set; } = new List<RentalCharge>();
    public SecurityDeposit? SecurityDeposit { get; set; }
}

public class VehicleInspection
{
    [Key]
    public Guid InspectionId { get; set; } = Guid.NewGuid();
    public Guid RentalAgreementId { get; set; }
    public RentalAgreement RentalAgreement { get; set; } = null!;

    public InspectionStage Stage { get; set; }
    public int OdometerKm { get; set; }
    public int FuelLevelPercent { get; set; }
    public string DamageNotes { get; set; } = string.Empty;
    public List<string> PhotoUrls { get; set; } = new();
    public Guid InspectedByUserId { get; set; }
    public DateTime InspectedAt { get; set; } = DateTime.UtcNow;
}

public class RentalCharge
{
    [Key]
    public Guid RentalChargeId { get; set; } = Guid.NewGuid();
    public Guid RentalAgreementId { get; set; }
    public RentalAgreement RentalAgreement { get; set; } = null!;

    public RentalChargeType Type { get; set; }
    public string Description { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
}

public class SecurityDeposit
{
    [Key]
    public Guid SecurityDepositId { get; set; } = Guid.NewGuid();
    public Guid RentalAgreementId { get; set; }
    public RentalAgreement RentalAgreement { get; set; } = null!;

    public decimal Amount { get; set; }
    public string CollectedVia { get; set; } = "UPI"; // UPI, CASH
    public DateTime? CollectedAt { get; set; }
    public decimal DeductedAmount { get; set; }
    public decimal RefundedAmount { get; set; }
    public string RefundedVia { get; set; } = string.Empty;
    public DateTime? RefundedAt { get; set; }
    public DepositStatus Status { get; set; } = DepositStatus.PENDING;
}
