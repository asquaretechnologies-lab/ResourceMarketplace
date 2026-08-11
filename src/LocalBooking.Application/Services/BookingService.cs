using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using LocalBooking.Application.DTOs;
using LocalBooking.Application.Interfaces;
using LocalBooking.Domain.Entities;
using LocalBooking.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace LocalBooking.Application.Services;

public class BookingService : IBookingService
{
    private readonly ILocalBookingDbContext _dbContext;

    public BookingService(ILocalBookingDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<BookingResponseDto> CreateBookingAsync(Guid userId, CreateBookingRequestDto request)
    {
        using var transaction = await _dbContext.Database.BeginTransactionAsync();

        try
        {
            var facility = await _dbContext.Facilities
                .FirstOrDefaultAsync(f => f.FacilityId == request.FacilityId);

            if (facility == null || facility.Status != FacilityStatusCode.APPROVED)
            {
                throw new InvalidOperationException("Facility is not active or available for booking.");
            }

            decimal baseAmount = 0.0m;
            string resourceName = string.Empty;
            string vehicleNumber = request.VehicleNumber ?? string.Empty;

            if (request.BookingType.ToUpper() == "PARKING")
            {
                if (!request.ParkingAreaId.HasValue)
                {
                    throw new ArgumentException("ParkingAreaId is required for parking bookings.");
                }

                var parkingArea = await _dbContext.ParkingAreas
                    .Include(pa => pa.VehicleType)
                    .FirstOrDefaultAsync(pa => pa.ParkingAreaId == request.ParkingAreaId.Value);

                if (parkingArea == null)
                {
                    throw new InvalidOperationException("Invalid parking area specified.");
                }

                // Check capacity within transaction to prevent overbooking
                int occupied = await _dbContext.BookingItems
                    .Where(bi => bi.ParkingAreaId == parkingArea.ParkingAreaId)
                    .Where(bi => bi.Booking.BookingStatus == BookingStatusCode.CONFIRMED ||
                                 bi.Booking.BookingStatus == BookingStatusCode.CHECKED_IN ||
                                 bi.Booking.BookingStatus == BookingStatusCode.PENDING ||
                                 bi.Booking.BookingStatus == BookingStatusCode.PAYMENT_PENDING)
                    .Where(bi => bi.Booking.StartDateTime < request.EndDateTime && bi.Booking.EndDateTime > request.StartDateTime)
                    .SumAsync(bi => (int?)bi.Quantity) ?? 0;

                int available = parkingArea.TotalCapacity - occupied;
                if (available < request.Quantity)
                {
                    throw new InvalidOperationException($"Parking area is full. Only {available} slots available for the requested time range.");
                }

                double durationHours = Math.Max(1.0, (request.EndDateTime - request.StartDateTime).TotalHours);
                baseAmount = parkingArea.PricePerHour * (decimal)durationHours * request.Quantity;
                resourceName = $"{parkingArea.VehicleType.Name} Parking ({request.Quantity} slot)";
            }
            else // SPORTS
            {
                if (!request.ResourceId.HasValue)
                {
                    throw new ArgumentException("ResourceId is required for sports court/turf bookings.");
                }

                var resource = await _dbContext.Resources
                    .FirstOrDefaultAsync(r => r.ResourceId == request.ResourceId.Value);

                if (resource == null)
                {
                    throw new InvalidOperationException("Invalid sports resource specified.");
                }

                bool isBooked = await _dbContext.BookingItems
                    .Where(bi => bi.ResourceId == resource.ResourceId)
                    .Where(bi => bi.Booking.BookingStatus == BookingStatusCode.CONFIRMED ||
                                 bi.Booking.BookingStatus == BookingStatusCode.CHECKED_IN ||
                                 bi.Booking.BookingStatus == BookingStatusCode.PENDING ||
                                 bi.Booking.BookingStatus == BookingStatusCode.PAYMENT_PENDING)
                    .AnyAsync(bi => bi.Booking.StartDateTime < request.EndDateTime && bi.Booking.EndDateTime > request.StartDateTime);

                if (isBooked)
                {
                    throw new InvalidOperationException("Sports court/turf is already reserved for the selected time slot.");
                }

                double durationHours = Math.Max(1.0, (request.EndDateTime - request.StartDateTime).TotalHours);
                decimal pricePerHour = 1000.0m; // Default or configured rule
                baseAmount = pricePerHour * (decimal)durationHours;
                resourceName = resource.Name;
            }

            decimal platformFee = Math.Round(baseAmount * (facility.CommissionRate / 100.0m), 2);
            decimal discount = 0.0m;

            if (!string.IsNullOrWhiteSpace(request.CouponCode))
            {
                var coupon = await _dbContext.Coupons
                    .FirstOrDefaultAsync(c => c.Code.ToUpper() == request.CouponCode.ToUpper() && c.Status == "ACTIVE");

                if (coupon != null && coupon.ValidTo >= DateTime.UtcNow && baseAmount >= coupon.MinBookingAmount)
                {
                    discount = coupon.DiscountType == DiscountType.PERCENTAGE
                        ? Math.Min(coupon.MaxDiscountAmount, baseAmount * (coupon.DiscountValue / 100.0m))
                        : coupon.DiscountValue;
                }
            }

            decimal totalAmount = Math.Max(0.0m, baseAmount + platformFee - discount);
            string bookingNum = $"{request.BookingType.Substring(0, 4).ToUpper()}-{DateTime.UtcNow:yyyyMMdd}-{Random.Shared.Next(100000, 999999)}";
            string qrToken = $"QR-{bookingNum}-{Guid.NewGuid().ToString("N").Substring(0, 12)}";

            var booking = new Booking
            {
                BookingId = Guid.NewGuid(),
                BookingNumber = bookingNum,
                UserId = userId,
                FacilityId = facility.FacilityId,
                BookingType = request.BookingType.ToUpper(),
                StartDateTime = request.StartDateTime,
                EndDateTime = request.EndDateTime,
                BookingStatus = BookingStatusCode.CONFIRMED,
                PaymentStatus = PaymentStatusCode.PAID,
                BaseAmount = baseAmount,
                TaxAmount = 0.0m,
                PlatformFee = platformFee,
                DiscountAmount = discount,
                TotalAmount = totalAmount,
                Currency = "INR",
                QRCodeToken = qrToken,
                GracePeriodMinutes = 30,
                CreatedDate = DateTime.UtcNow,
                UpdatedDate = DateTime.UtcNow
            };

            var bookingItem = new BookingItem
            {
                BookingItemId = Guid.NewGuid(),
                BookingId = booking.BookingId,
                ResourceId = request.ResourceId,
                ParkingAreaId = request.ParkingAreaId,
                VehicleTypeId = request.VehicleTypeId,
                VehicleNumber = vehicleNumber,
                Quantity = request.Quantity,
                UnitPrice = baseAmount / Math.Max(1, request.Quantity),
                TotalPrice = baseAmount
            };

            await _dbContext.Bookings.AddAsync(booking);
            await _dbContext.BookingItems.AddAsync(bookingItem);

            // Add Payment log
            var payment = new Payment
            {
                PaymentId = Guid.NewGuid(),
                BookingId = booking.BookingId,
                PaymentNumber = $"PAY-{DateTime.UtcNow:yyyyMMddHHmmss}-{Random.Shared.Next(1000, 9999)}",
                TransactionId = $"TXN_RAZORPAY_{Guid.NewGuid().ToString("N").Substring(0, 10)}",
                PaymentGateway = "RAZORPAY",
                PaymentMethod = "UPI",
                Amount = totalAmount,
                Currency = "INR",
                Status = PaymentStatusCode.PAID,
                ResponsePayload = "SUCCESS",
                CreatedDate = DateTime.UtcNow
            };
            await _dbContext.Payments.AddAsync(payment);

            await _dbContext.SaveChangesAsync();
            await transaction.CommitAsync();

            return MapToResponseDto(booking, facility.Name, facility.Address, resourceName, vehicleNumber);
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    public async Task<List<BookingResponseDto>> GetUserBookingsAsync(Guid userId)
    {
        var bookings = await _dbContext.Bookings
            .AsNoTracking()
            .Include(b => b.Facility)
            .Include(b => b.BookingItems).ThenInclude(bi => bi.Resource)
            .Where(b => b.UserId == userId)
            .OrderByDescending(b => b.CreatedDate)
            .ToListAsync();

        return bookings.Select(b => {
            var item = b.BookingItems.FirstOrDefault();
            return MapToResponseDto(b, b.Facility.Name, b.Facility.Address, item?.Resource?.Name ?? "Parking Space", item?.VehicleNumber ?? "");
        }).ToList();
    }

    public async Task<BookingResponseDto?> GetBookingByIdAsync(Guid bookingId)
    {
        var b = await _dbContext.Bookings
            .AsNoTracking()
            .Include(b => b.Facility)
            .Include(b => b.BookingItems).ThenInclude(bi => bi.Resource)
            .FirstOrDefaultAsync(b => b.BookingId == bookingId);

        if (b == null) return null;
        var item = b.BookingItems.FirstOrDefault();
        return MapToResponseDto(b, b.Facility.Name, b.Facility.Address, item?.Resource?.Name ?? "Parking Space", item?.VehicleNumber ?? "");
    }

    public async Task<CheckInResponseDto> ProcessCheckInOrOutAsync(Guid staffUserId, CheckInRequestDto request)
    {
        var booking = await _dbContext.Bookings
            .Include(b => b.Facility)
            .Include(b => b.BookingItems)
            .Include(b => b.CheckInRecord)
            .FirstOrDefaultAsync(b => b.QRCodeToken == request.QRCodeTokenOrBookingNumber ||
                                       b.BookingNumber == request.QRCodeTokenOrBookingNumber);

        if (booking == null)
        {
            return new CheckInResponseDto(false, "Booking not found with provided QR token or Booking number.", null, "INVALID");
        }

        if (booking.CheckInRecord == null)
        {
            booking.CheckInRecord = new BookingCheckIn
            {
                CheckInId = Guid.NewGuid(),
                BookingId = booking.BookingId
            };
        }

        if (booking.BookingStatus == BookingStatusCode.CONFIRMED)
        {
            // Perform Check-in
            booking.BookingStatus = BookingStatusCode.CHECKED_IN;
            booking.CheckInRecord.CheckedInTime = DateTime.UtcNow;
            booking.CheckInRecord.CheckedInByUserId = staffUserId;
            booking.UpdatedDate = DateTime.UtcNow;

            await _dbContext.SaveChangesAsync();

            var item = booking.BookingItems.FirstOrDefault();
            var responseDto = MapToResponseDto(booking, booking.Facility.Name, booking.Facility.Address, item?.Resource?.Name ?? "Parking", item?.VehicleNumber ?? "");
            return new CheckInResponseDto(true, $"Customer checked in successfully at {DateTime.Now:hh:mm tt}.", responseDto, "CHECKED_IN");
        }
        else if (booking.BookingStatus == BookingStatusCode.CHECKED_IN)
        {
            // Perform Check-out
            booking.BookingStatus = BookingStatusCode.COMPLETED;
            booking.CheckInRecord.CheckedOutTime = DateTime.UtcNow;
            booking.CheckInRecord.CheckedOutByUserId = staffUserId;

            if (DateTime.UtcNow > booking.EndDateTime)
            {
                int overtimeMinutes = (int)(DateTime.UtcNow - booking.EndDateTime).TotalMinutes;
                booking.CheckInRecord.OvertimeMinutes = overtimeMinutes;
                booking.CheckInRecord.AdditionalCharge = Math.Round(overtimeMinutes * 0.5m, 2); // 0.5 INR per overtime minute
            }

            booking.UpdatedDate = DateTime.UtcNow;
            await _dbContext.SaveChangesAsync();

            var item = booking.BookingItems.FirstOrDefault();
            var responseDto = MapToResponseDto(booking, booking.Facility.Name, booking.Facility.Address, item?.Resource?.Name ?? "Parking", item?.VehicleNumber ?? "");
            return new CheckInResponseDto(true, $"Customer checked out successfully at {DateTime.Now:hh:mm tt}.", responseDto, "CHECKED_OUT");
        }
        else
        {
            var item = booking.BookingItems.FirstOrDefault();
            var responseDto = MapToResponseDto(booking, booking.Facility.Name, booking.Facility.Address, item?.Resource?.Name ?? "Parking", item?.VehicleNumber ?? "");
            return new CheckInResponseDto(false, $"Booking is already in '{booking.BookingStatus}' state.", responseDto, "ALREADY_COMPLETED");
        }
    }

    public async Task<bool> CancelBookingAsync(Guid userId, Guid bookingId)
    {
        var booking = await _dbContext.Bookings.FirstOrDefaultAsync(b => b.BookingId == bookingId && b.UserId == userId);
        if (booking == null || (booking.BookingStatus != BookingStatusCode.CONFIRMED && booking.BookingStatus != BookingStatusCode.PENDING))
        {
            return false;
        }

        booking.BookingStatus = BookingStatusCode.CANCELLED;
        booking.PaymentStatus = PaymentStatusCode.REFUND_PENDING;
        booking.UpdatedDate = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync();
        return true;
    }

    private static BookingResponseDto MapToResponseDto(Booking b, string facilityName, string facilityAddress, string resourceName, string vehicleNumber)
    {
        return new BookingResponseDto(
            b.BookingId,
            b.BookingNumber,
            b.FacilityId,
            facilityName,
            facilityAddress,
            b.BookingType,
            b.StartDateTime,
            b.EndDateTime,
            b.BookingStatus.ToString(),
            b.PaymentStatus.ToString(),
            b.BaseAmount,
            b.TaxAmount,
            b.PlatformFee,
            b.DiscountAmount,
            b.TotalAmount,
            b.QRCodeToken,
            vehicleNumber,
            resourceName,
            b.CreatedDate
        );
    }
}
