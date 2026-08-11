using System;
using System.Collections.Generic;

namespace LocalBooking.Application.DTOs;

public record FacilitySearchQueryDto(
    string? Keyword = null,
    string? FacilityType = null, // SPORTS, PARKING
    string? SportsType = null,
    string? VehicleType = null,
    double? Latitude = null,
    double? Longitude = null,
    double RadiusKm = 25.0,
    string? District = null,
    DateTime? StartDateTime = null,
    DateTime? EndDateTime = null
);

public record FacilityDto(
    Guid FacilityId,
    string Name,
    string Description,
    string Address,
    string District,
    string State,
    string PostalCode,
    double Latitude,
    double Longitude,
    string Landmark,
    double DistanceKm,
    bool Is24Hours,
    string OpeningTime,
    string ClosingTime,
    string FacilityType,
    string Status,
    double Rating,
    int ReviewCount,
    List<string> Photos,
    List<string> Features,
    List<ParkingAreaDto> ParkingAreas,
    List<ResourceDto> Resources
);

public record ParkingAreaDto(
    Guid ParkingAreaId,
    int VehicleTypeId,
    string VehicleTypeCode,
    string VehicleTypeName,
    int TotalCapacity,
    int AvailableCapacity,
    decimal PricePerHour,
    decimal PricePerDay,
    decimal PricePerOvernight,
    decimal PricePerMonth
);

public record ResourceDto(
    Guid ResourceId,
    string Name,
    string Description,
    int? SportsTypeId,
    string? SportsTypeName,
    int Capacity,
    int SlotDurationMinutes,
    decimal PricePerHour,
    bool IsAvailable
);
