using System;
using System.Linq;
using System.Threading.Tasks;
using LocalBooking.Application.Interfaces;
using LocalBooking.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace LocalBooking.Application.Services;

public class AvailabilityService : IAvailabilityService
{
    private readonly ILocalBookingDbContext _dbContext;

    public AvailabilityService(ILocalBookingDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<int> GetAvailableParkingCapacityAsync(Guid parkingAreaId, DateTime start, DateTime end)
    {
        var parkingArea = await _dbContext.ParkingAreas
            .AsNoTracking()
            .FirstOrDefaultAsync(p => p.ParkingAreaId == parkingAreaId);

        if (parkingArea == null) return 0;

        int occupied = await _dbContext.BookingItems
            .AsNoTracking()
            .Where(bi => bi.ParkingAreaId == parkingAreaId)
            .Where(bi => bi.Booking.BookingStatus == BookingStatusCode.CONFIRMED ||
                         bi.Booking.BookingStatus == BookingStatusCode.CHECKED_IN ||
                         bi.Booking.BookingStatus == BookingStatusCode.PENDING ||
                         bi.Booking.BookingStatus == BookingStatusCode.PAYMENT_PENDING)
            .Where(bi => bi.Booking.StartDateTime < end && bi.Booking.EndDateTime > start)
            .SumAsync(bi => (int?)bi.Quantity) ?? 0;

        int available = parkingArea.TotalCapacity - occupied;
        return Math.Max(0, available);
    }

    public async Task<bool> IsSportsResourceAvailableAsync(Guid resourceId, DateTime start, DateTime end)
    {
        // 1. Check blocked periods
        bool isBlocked = await _dbContext.BlockedPeriods
            .AsNoTracking()
            .Where(bp => bp.ResourceId == resourceId)
            .AnyAsync(bp => bp.StartDateTime < end && bp.EndDateTime > start);

        if (isBlocked) return false;

        // 2. Check overlapping bookings
        bool isBooked = await _dbContext.BookingItems
            .AsNoTracking()
            .Where(bi => bi.ResourceId == resourceId)
            .Where(bi => bi.Booking.BookingStatus == BookingStatusCode.CONFIRMED ||
                         bi.Booking.BookingStatus == BookingStatusCode.CHECKED_IN ||
                         bi.Booking.BookingStatus == BookingStatusCode.PENDING ||
                         bi.Booking.BookingStatus == BookingStatusCode.PAYMENT_PENDING)
            .AnyAsync(bi => bi.Booking.StartDateTime < end && bi.Booking.EndDateTime > start);

        return !isBooked;
    }
}
