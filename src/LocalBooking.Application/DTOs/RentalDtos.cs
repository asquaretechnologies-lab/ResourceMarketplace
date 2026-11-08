using System;
using System.Collections.Generic;
using LocalBooking.Domain.Enums;

namespace LocalBooking.Application.DTOs;

public record VehicleModelDto(
    int VehicleModelId,
    string Category,
    string Make,
    string Model,
    int Seats,
    string FuelType,
    string Transmission,
    int? EngineCc
);

public record RentalPlanDto(
    Guid RentalPlanId,
    Guid FacilityId,
    string Name,
    decimal? PricePerHour,
    decimal PricePerDay,
    decimal? PricePerWeek,
    int MinHours,
    int? FreeKmPerDay,
    decimal ExtraKmCharge,
    decimal LateFeePerHour,
    int GraceMinutes,
    decimal SecurityDepositAmount,
    bool HelmetIncluded,
    string FuelPolicy,
    bool IsActive
);

public record CreateRentalPlanRequestDto(
    Guid FacilityId,
    string Name,
    decimal? PricePerHour,
    decimal PricePerDay,
    decimal? PricePerWeek,
    int MinHours,
    int? FreeKmPerDay,
    decimal ExtraKmCharge,
    decimal LateFeePerHour,
    int GraceMinutes,
    decimal SecurityDepositAmount,
    bool HelmetIncluded,
    FuelPolicy FuelPolicy
);

public record VehicleDto(
    Guid VehicleId,
    Guid FacilityId,
    int VehicleModelId,
    string Make,
    string Model,
    string Category,
    string Transmission,
    string FuelType,
    int Seats,
    Guid RentalPlanId,
    string RentalPlanName,
    decimal PricePerDay,
    decimal? PricePerHour,
    decimal SecurityDepositAmount,
    string RegistrationNumber,
    string Color,
    int? Year,
    int OdometerKm,
    int FuelLevelPercent,
    string Status,
    DateTime? InsuranceExpiry,
    DateTime? PollutionExpiry,
    DateTime? PermitExpiry,
    bool IsListedOnline,
    List<string> Photos
);

public record CreateVehicleRequestDto(
    Guid FacilityId,
    int VehicleModelId,
    Guid RentalPlanId,
    string RegistrationNumber,
    string Color,
    int? Year,
    string Description,
    int OdometerKm,
    int FuelLevelPercent,
    DateTime? InsuranceExpiry,
    DateTime? PollutionExpiry,
    DateTime? PermitExpiry,
    bool IsListedOnline,
    List<string>? PhotoUrls
);

public record DriverDto(
    Guid DriverId,
    Guid FacilityId,
    string Name,
    string Phone,
    string LicenceNumber,
    DateTime? LicenceExpiry,
    string Languages,
    decimal ChargePerDay,
    decimal NightAllowance,
    string Status,
    string PhotoUrl,
    bool IsActive
);

public record CreateDriverRequestDto(
    Guid FacilityId,
    string Name,
    string Phone,
    string LicenceNumber,
    DateTime? LicenceExpiry,
    string Languages,
    decimal ChargePerDay,
    decimal NightAllowance,
    string? PhotoUrl
);

public record RenterLookupDto(
    Guid? RenterProfileId,
    string Phone,
    string FullName,
    string AlternatePhone,
    string Email,
    string Nationality,
    string HomeAddress,
    string LocalStayAddress,
    bool IsBlacklisted,
    string BlacklistReason,
    int TotalPreviousRentals
);

public record WalkInBookingRequestDto(
    Guid FacilityId,
    Guid VehicleId,
    string CustomerName,
    string CustomerPhone,
    string? AlternatePhone,
    string? CustomerEmail,
    string? HomeAddress,
    string? LocalStayAddress,
    string? LicenceNumber,
    DateTime StartDateTime,
    DateTime EndDateTime,
    bool WithDriver,
    Guid? DriverId,
    HandoverMode PickupMode,
    string? PickupAddress,
    HandoverMode DropMode,
    string? DropAddress,
    int HelmetsGiven,
    decimal SecurityDepositAmount,
    string DepositPaymentMethod, // UPI or CASH
    string RentPaymentMethod,    // UPI or CASH
    string? UpiReference,
    string? Notes
);

public record RentalBoardItemDto(
    Guid BookingId,
    Guid RentalAgreementId,
    string BookingNumber,
    Guid VehicleId,
    string VehicleName,
    string RegistrationNumber,
    string Category,
    string CustomerName,
    string CustomerPhone,
    DateTime ScheduledPickup,
    DateTime ScheduledReturn,
    DateTime? ActualPickup,
    DateTime? ActualReturn,
    string BookingStatus,
    string PaymentStatus,
    decimal TotalAmount,
    decimal DepositAmount,
    bool WithDriver,
    string? DriverName,
    int? OverdueMinutes
);

public record TodayBoardResponseDto(
    int TotalFleetCount,
    int AvailableCount,
    int OnRentCount,
    int MaintenanceCount,
    List<RentalBoardItemDto> PickupsDue,
    List<RentalBoardItemDto> ActiveOnRent,
    List<RentalBoardItemDto> ReturnsDue,
    List<RentalBoardItemDto> Overdue
);

public record PickupHandoverRequestDto(
    int OdometerKm,
    int FuelLevelPercent,
    int HelmetsGiven,
    string? DamageNotes,
    List<string>? PhotoUrls,
    string? CustomerSignatureUrl
);

public record ReturnInspectionRequestDto(
    int OdometerKm,
    int FuelLevelPercent,
    string? DamageNotes,
    List<string>? PhotoUrls
);

public record ReturnEstimateResponseDto(
    Guid RentalAgreementId,
    int StartOdometer,
    int EndOdometer,
    int TotalKmDriven,
    int? FreeKmAllowed,
    int ExtraKm,
    decimal ExtraKmCharge,
    int ScheduledHours,
    int ActualHours,
    int OvertimeHours,
    decimal LateFee,
    decimal FuelPenaltyCharge,
    decimal DamageCharge,
    decimal TotalExtraCharges,
    decimal DepositHeld,
    decimal NetRefundOrDue,
    bool IsRefundDue
);

public record SettleRentalRequestDto(
    decimal ExtraKmCharge,
    decimal LateFeeCharge,
    decimal FuelCharge,
    decimal DamageCharge,
    decimal OtherCharges,
    string? OtherChargesNotes,
    decimal DepositDeducted,
    decimal DepositRefunded,
    string RefundMethod // UPI or CASH
);

public record DailyRentalReportDto(
    DateTime Date,
    int TotalBookings,
    int TotalPickups,
    int TotalReturns,
    decimal TotalRentCollected,
    decimal TotalCashCollected,
    decimal TotalUpiCollected,
    decimal TotalDepositsHeld,
    decimal TotalDepositsRefunded,
    decimal TotalExtraChargesCollected
);
