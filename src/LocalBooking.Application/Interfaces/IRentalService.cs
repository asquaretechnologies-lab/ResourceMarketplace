using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using LocalBooking.Application.DTOs;
using LocalBooking.Domain.Enums;

namespace LocalBooking.Application.Interfaces;

public interface IRentalService
{
    // Fleet & Metadata
    Task<List<VehicleModelDto>> GetVehicleModelsAsync();
    Task<List<VehicleDto>> GetOwnerVehiclesAsync(Guid facilityId);
    Task<VehicleDto> CreateVehicleAsync(Guid ownerUserId, CreateVehicleRequestDto request);
    Task<bool> UpdateVehicleStatusAsync(Guid ownerUserId, Guid vehicleId, VehicleStatus status);

    // Plans & Drivers
    Task<List<RentalPlanDto>> GetRentalPlansAsync(Guid facilityId);
    Task<RentalPlanDto> CreateRentalPlanAsync(Guid ownerUserId, CreateRentalPlanRequestDto request);
    Task<List<DriverDto>> GetDriversAsync(Guid facilityId);
    Task<DriverDto> CreateDriverAsync(Guid ownerUserId, CreateDriverRequestDto request);

    // Digital Register & Walk-in
    Task<RenterLookupDto?> LookupRenterByPhoneAsync(Guid facilityId, string phone);
    Task<BookingResponseDto> CreateWalkInBookingAsync(Guid staffUserId, WalkInBookingRequestDto request);

    // Today Operations Board
    Task<TodayBoardResponseDto> GetTodayBoardAsync(Guid facilityId, DateTime? date = null);

    // Pickup, Return, Settlement
    Task<bool> ProcessPickupAsync(Guid staffUserId, Guid bookingId, PickupHandoverRequestDto request);
    Task<ReturnEstimateResponseDto> ProcessReturnInspectionAsync(Guid staffUserId, Guid bookingId, ReturnInspectionRequestDto request);
    Task<bool> SettleRentalAsync(Guid staffUserId, Guid bookingId, SettleRentalRequestDto request);

    // Reports
    Task<DailyRentalReportDto> GetDailyReportAsync(Guid facilityId, DateTime date);
}
