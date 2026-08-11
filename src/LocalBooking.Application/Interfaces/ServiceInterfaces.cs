using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using LocalBooking.Application.DTOs;

namespace LocalBooking.Application.Interfaces;

public interface IAuthService
{
    Task<AuthResponseDto> RegisterAsync(RegisterRequestDto request);
    Task<AuthResponseDto> LoginAsync(LoginRequestDto request);
}

public interface IFacilityService
{
    Task<List<FacilityDto>> SearchFacilitiesAsync(FacilitySearchQueryDto query);
    Task<FacilityDto?> GetFacilityByIdAsync(Guid facilityId, DateTime? startDateTime = null, DateTime? endDateTime = null);
}

public interface IAvailabilityService
{
    Task<int> GetAvailableParkingCapacityAsync(Guid parkingAreaId, DateTime start, DateTime end);
    Task<bool> IsSportsResourceAvailableAsync(Guid resourceId, DateTime start, DateTime end);
}

public interface IBookingService
{
    Task<BookingResponseDto> CreateBookingAsync(Guid userId, CreateBookingRequestDto request);
    Task<List<BookingResponseDto>> GetUserBookingsAsync(Guid userId);
    Task<BookingResponseDto?> GetBookingByIdAsync(Guid bookingId);
    Task<CheckInResponseDto> ProcessCheckInOrOutAsync(Guid staffUserId, CheckInRequestDto request);
    Task<bool> CancelBookingAsync(Guid userId, Guid bookingId);
}
