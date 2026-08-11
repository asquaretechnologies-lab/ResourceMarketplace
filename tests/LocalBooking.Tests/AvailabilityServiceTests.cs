using System;
using System.Threading.Tasks;
using LocalBooking.Application.Services;
using LocalBooking.Domain.Entities;
using LocalBooking.Domain.Enums;
using LocalBooking.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace LocalBooking.Tests;

public class AvailabilityServiceTests
{
    private LocalBookingDbContext GetInMemoryDbContext(string dbName)
    {
        var options = new DbContextOptionsBuilder<LocalBookingDbContext>()
            .UseInMemoryDatabase(databaseName: dbName)
            .Options;
        return new LocalBookingDbContext(options);
    }

    [Fact]
    public async Task ParkingCapacity_DeductsActiveOverlappingBookingsCorrectly()
    {
        // Arrange
        var context = GetInMemoryDbContext(Guid.NewGuid().ToString());
        var parkingAreaId = Guid.NewGuid();

        var parkingArea = new ParkingArea
        {
            ParkingAreaId = parkingAreaId,
            FacilityId = Guid.NewGuid(),
            VehicleTypeId = 2,
            TotalCapacity = 30,
            PricePerHour = 30.0m
        };

        await context.ParkingAreas.AddAsync(parkingArea);

        // Add 18 active overlapping car bookings
        var booking = new Booking
        {
            BookingId = Guid.NewGuid(),
            BookingNumber = "PARK-TEST-100",
            UserId = Guid.NewGuid(),
            FacilityId = parkingArea.FacilityId,
            BookingType = "PARKING",
            StartDateTime = DateTime.UtcNow.AddHours(-1),
            EndDateTime = DateTime.UtcNow.AddHours(3),
            BookingStatus = BookingStatusCode.CONFIRMED
        };

        var bookingItem = new BookingItem
        {
            BookingItemId = Guid.NewGuid(),
            BookingId = booking.BookingId,
            ParkingAreaId = parkingAreaId,
            Quantity = 18
        };

        await context.Bookings.AddAsync(booking);
        await context.BookingItems.AddAsync(bookingItem);
        await context.SaveChangesAsync();

        var availabilityService = new AvailabilityService(context);

        // Act: Check availability for overlapping window
        int available = await availabilityService.GetAvailableParkingCapacityAsync(
            parkingAreaId, 
            DateTime.UtcNow, 
            DateTime.UtcNow.AddHours(2)
        );

        // Assert: 30 total capacity - 18 occupied = 12 available slots
        Assert.Equal(12, available);
    }

    [Fact]
    public async Task SportsResource_ReturnsFalse_WhenOverlappingBookingExists()
    {
        // Arrange
        var context = GetInMemoryDbContext(Guid.NewGuid().ToString());
        var resourceId = Guid.NewGuid();

        var resource = new Resource
        {
            ResourceId = resourceId,
            FacilityId = Guid.NewGuid(),
            Name = "Turf 1",
            Capacity = 14
        };

        await context.Resources.AddAsync(resource);

        var booking = new Booking
        {
            BookingId = Guid.NewGuid(),
            BookingNumber = "SPORT-TEST-200",
            UserId = Guid.NewGuid(),
            FacilityId = resource.FacilityId,
            BookingType = "SPORTS",
            StartDateTime = DateTime.UtcNow.AddHours(1),
            EndDateTime = DateTime.UtcNow.AddHours(2),
            BookingStatus = BookingStatusCode.CONFIRMED
        };

        var bookingItem = new BookingItem
        {
            BookingItemId = Guid.NewGuid(),
            BookingId = booking.BookingId,
            ResourceId = resourceId,
            Quantity = 1
        };

        await context.Bookings.AddAsync(booking);
        await context.BookingItems.AddAsync(bookingItem);
        await context.SaveChangesAsync();

        var availabilityService = new AvailabilityService(context);

        // Act
        bool isAvailable = await availabilityService.IsSportsResourceAvailableAsync(
            resourceId, 
            DateTime.UtcNow.AddHours(1), 
            DateTime.UtcNow.AddHours(2)
        );

        // Assert
        Assert.False(isAvailable);
    }
}
