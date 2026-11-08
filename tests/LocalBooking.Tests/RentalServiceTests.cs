using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using LocalBooking.Application.DTOs;
using LocalBooking.Application.Services;
using LocalBooking.Domain.Entities;
using LocalBooking.Domain.Enums;
using LocalBooking.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace LocalBooking.Tests;

public class RentalServiceTests
{
    private LocalBookingDbContext GetInMemoryDbContext(string dbName)
    {
        var options = new DbContextOptionsBuilder<LocalBookingDbContext>()
            .UseInMemoryDatabase(databaseName: dbName)
            .Options;
        return new LocalBookingDbContext(options);
    }

    [Fact]
    public async Task WalkInBooking_Succeeds_And_PreventsDoubleBooking()
    {
        var context = GetInMemoryDbContext(Guid.NewGuid().ToString());

        var facilityId = Guid.NewGuid();
        var facility = new Facility
        {
            FacilityId = facilityId,
            OwnerId = Guid.NewGuid(),
            Name = "Munnar Mountain Wheels",
            CommissionRate = 0.0m
        };

        var model = new VehicleModel
        {
            VehicleModelId = 1,
            Make = "Royal Enfield",
            Model = "Himalayan 450",
            Category = VehicleCategory.BIKE,
            FuelType = FuelType.PETROL,
            Transmission = TransmissionType.MANUAL
        };

        var plan = new RentalPlan
        {
            RentalPlanId = Guid.NewGuid(),
            FacilityId = facilityId,
            Name = "Daily Explorer",
            PricePerDay = 1400.0m,
            FreeKmPerDay = 180,
            ExtraKmCharge = 7.0m,
            LateFeePerHour = 200.0m,
            GraceMinutes = 30,
            SecurityDepositAmount = 3000.0m
        };

        var vehicle = new Vehicle
        {
            VehicleId = Guid.NewGuid(),
            FacilityId = facilityId,
            VehicleModelId = model.VehicleModelId,
            RentalPlanId = plan.RentalPlanId,
            RegistrationNumber = "KL 07 CB 5544",
            Status = VehicleStatus.AVAILABLE,
            OdometerKm = 6000,
            FuelLevelPercent = 100
        };

        await context.Facilities.AddAsync(facility);
        await context.VehicleModels.AddAsync(model);
        await context.RentalPlans.AddAsync(plan);
        await context.Vehicles.AddAsync(vehicle);
        await context.SaveChangesAsync();

        var service = new RentalService(context);
        var staffId = Guid.NewGuid();

        var request = new WalkInBookingRequestDto(
            FacilityId: facilityId,
            VehicleId: vehicle.VehicleId,
            CustomerName: "Anand Menon",
            CustomerPhone: "+919847001122",
            AlternatePhone: null,
            CustomerEmail: "anand@example.com",
            HomeAddress: "Kozhikode, Kerala",
            LocalStayAddress: "Tea County, Munnar",
            LicenceNumber: "KL-11-2016-004455",
            StartDateTime: new DateTime(2026, 11, 1, 10, 0, 0, DateTimeKind.Utc),
            EndDateTime: new DateTime(2026, 11, 3, 10, 0, 0, DateTimeKind.Utc),
            WithDriver: false,
            DriverId: null,
            PickupMode: HandoverMode.AT_SHOP,
            PickupAddress: null,
            DropMode: HandoverMode.AT_SHOP,
            DropAddress: null,
            HelmetsGiven: 2,
            SecurityDepositAmount: 3000.0m,
            DepositPaymentMethod: "UPI",
            RentPaymentMethod: "UPI",
            UpiReference: "UPI998877665544",
            Notes: "Trip to Top Station"
        );

        // 1. First booking should succeed
        var booking = await service.CreateWalkInBookingAsync(staffId, request);
        Assert.NotNull(booking);
        Assert.Equal("CONFIRMED", booking.BookingStatus);
        Assert.Equal(2800.0m, booking.TotalAmount); // 2 days * 1400

        // 2. Second overlapping walk-in booking for same vehicle must throw double-booking exception
        await Assert.ThrowsAsync<InvalidOperationException>(async () =>
        {
            await service.CreateWalkInBookingAsync(staffId, request with
            {
                CustomerName = "Another Tourist",
                CustomerPhone = "+919847998877"
            });
        });
    }

    [Fact]
    public async Task WalkInBooking_Throws_WhenCustomerIsBlacklistedByShop()
    {
        var context = GetInMemoryDbContext(Guid.NewGuid().ToString());
        var facilityId = Guid.NewGuid();

        var facility = new Facility { FacilityId = facilityId, Name = "Kochi Wheels" };
        var model = new VehicleModel { VehicleModelId = 1, Make = "Honda", Model = "Activa" };
        var plan = new RentalPlan { RentalPlanId = Guid.NewGuid(), FacilityId = facilityId, PricePerDay = 500 };
        var vehicle = new Vehicle { VehicleId = Guid.NewGuid(), FacilityId = facilityId, VehicleModelId = 1, RentalPlanId = plan.RentalPlanId, Status = VehicleStatus.AVAILABLE };

        var renter = new RenterProfile
        {
            RenterProfileId = Guid.NewGuid(),
            FullName = "Bad Driver",
            Phone = "9847111222"
        };

        var flag = new ShopRenterFlag
        {
            FacilityId = facilityId,
            RenterProfileId = renter.RenterProfileId,
            IsBlacklisted = true,
            Reason = "Returned vehicle damaged without paying repair cost"
        };

        await context.Facilities.AddAsync(facility);
        await context.VehicleModels.AddAsync(model);
        await context.RentalPlans.AddAsync(plan);
        await context.Vehicles.AddAsync(vehicle);
        await context.RenterProfiles.AddAsync(renter);
        await context.ShopRenterFlags.AddAsync(flag);
        await context.SaveChangesAsync();

        var service = new RentalService(context);

        var request = new WalkInBookingRequestDto(
            FacilityId: facilityId,
            VehicleId: vehicle.VehicleId,
            CustomerName: "Bad Driver",
            CustomerPhone: "9847111222",
            AlternatePhone: null,
            CustomerEmail: null,
            HomeAddress: null,
            LocalStayAddress: null,
            LicenceNumber: null,
            StartDateTime: DateTime.UtcNow,
            EndDateTime: DateTime.UtcNow.AddDays(1),
            WithDriver: false,
            DriverId: null,
            PickupMode: HandoverMode.AT_SHOP,
            PickupAddress: null,
            DropMode: HandoverMode.AT_SHOP,
            DropAddress: null,
            HelmetsGiven: 1,
            SecurityDepositAmount: 1000,
            DepositPaymentMethod: "CASH",
            RentPaymentMethod: "CASH",
            UpiReference: null,
            Notes: null
        );

        var ex = await Assert.ThrowsAsync<InvalidOperationException>(() =>
            service.CreateWalkInBookingAsync(Guid.NewGuid(), request));

        Assert.Contains("blacklisted", ex.Message, StringComparison.OrdinalIgnoreCase);
    }
}
