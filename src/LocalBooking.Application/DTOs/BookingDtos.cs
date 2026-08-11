using System;
using System.Collections.Generic;

namespace LocalBooking.Application.DTOs;

public record CreateBookingRequestDto(
    Guid FacilityId,
    string BookingType, // SPORTS, PARKING
    DateTime StartDateTime,
    DateTime EndDateTime,
    Guid? ResourceId,        // For Sports
    Guid? ParkingAreaId,     // For Parking
    int? VehicleTypeId,      // For Parking
    string? VehicleNumber,   // For Parking
    int Quantity = 1,
    string? CouponCode = null
);

public record BookingResponseDto(
    Guid BookingId,
    string BookingNumber,
    Guid FacilityId,
    string FacilityName,
    string FacilityAddress,
    string BookingType,
    DateTime StartDateTime,
    DateTime EndDateTime,
    string BookingStatus,
    string PaymentStatus,
    decimal BaseAmount,
    decimal TaxAmount,
    decimal PlatformFee,
    decimal DiscountAmount,
    decimal TotalAmount,
    string QRCodeToken,
    string VehicleNumber,
    string ResourceName,
    DateTime CreatedDate
);

public record CheckInRequestDto(
    string QRCodeTokenOrBookingNumber
);

public record CheckInResponseDto(
    bool Success,
    string Message,
    BookingResponseDto? Booking,
    string Action // CHECKED_IN or CHECKED_OUT
);
