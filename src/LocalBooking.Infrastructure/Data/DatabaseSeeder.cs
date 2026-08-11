using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using LocalBooking.Domain.Entities;
using LocalBooking.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace LocalBooking.Infrastructure.Data;

public static class DatabaseSeeder
{
    public static async Task SeedAsync(LocalBookingDbContext context)
    {
        await context.Database.EnsureCreatedAsync();

        if (await context.Users.AnyAsync())
        {
            return; // DB has been seeded already
        }

        // 1. Roles
        var roleAdmin = new Role { RoleId = 1, Name = "ADMIN", Description = "System Administrator" };
        var roleOwner = new Role { RoleId = 2, Name = "OWNER", Description = "Facility Owner" };
        var roleCustomer = new Role { RoleId = 3, Name = "CUSTOMER", Description = "Registered Customer" };
        var roleStaff = new Role { RoleId = 4, Name = "STAFF", Description = "Check-in Staff" };

        await context.Roles.AddRangeAsync(roleAdmin, roleOwner, roleCustomer, roleStaff);

        // 2. Users (Password for all: "Password123!")
        string passwordHash = BCrypt.Net.BCrypt.HashPassword("Password123!");

        var adminUser = new User
        {
            UserId = Guid.Parse("11111111-1111-1111-1111-111111111111"),
            Name = "System Admin",
            Email = "admin@localbooking.com",
            Mobile = "+919876543210",
            PasswordHash = passwordHash,
            UserType = UserType.ADMIN,
            Status = UserStatus.ACTIVE
        };

        var ownerUser1 = new User
        {
            UserId = Guid.Parse("22222222-2222-2222-2222-222222222222"),
            Name = "Aravind (Railway Parking Owner)",
            Email = "aravind.owner@gmail.com",
            Mobile = "+919847012345",
            PasswordHash = passwordHash,
            UserType = UserType.OWNER,
            Status = UserStatus.ACTIVE
        };

        var ownerUser2 = new User
        {
            UserId = Guid.Parse("33333333-3333-3333-3333-333333333333"),
            Name = "Kochi Sports Arena Owner",
            Email = "sports.owner@gmail.com",
            Mobile = "+919847098765",
            PasswordHash = passwordHash,
            UserType = UserType.OWNER,
            Status = UserStatus.ACTIVE
        };

        var customerUser = new User
        {
            UserId = Guid.Parse("44444444-4444-4444-4444-444444444444"),
            Name = "Rahul Nair (Customer)",
            Email = "rahul.nair@gmail.com",
            Mobile = "+919846011223",
            PasswordHash = passwordHash,
            UserType = UserType.CUSTOMER,
            Status = UserStatus.ACTIVE
        };

        await context.Users.AddRangeAsync(adminUser, ownerUser1, ownerUser2, customerUser);

        // 3. User Roles
        await context.UserRoles.AddRangeAsync(
            new UserRole { UserId = adminUser.UserId, RoleId = roleAdmin.RoleId },
            new UserRole { UserId = ownerUser1.UserId, RoleId = roleOwner.RoleId },
            new UserRole { UserId = ownerUser2.UserId, RoleId = roleOwner.RoleId },
            new UserRole { UserId = customerUser.UserId, RoleId = roleCustomer.RoleId }
        );

        // 4. Facility Types
        var typeSports = new FacilityType { FacilityTypeId = 1, Code = "SPORTS", Name = "Sports Arena & Turf", Icon = "sports_soccer" };
        var typeParking = new FacilityType { FacilityTypeId = 2, Code = "PARKING", Name = "Parking Facility", Icon = "local_parking" };
        var typeEV = new FacilityType { FacilityTypeId = 3, Code = "EV_CHARGING", Name = "EV Charging Station", Icon = "ev_station" };

        await context.FacilityTypes.AddRangeAsync(typeSports, typeParking, typeEV);

        // 5. Vehicle Types
        var vTwoWheeler = new VehicleType { VehicleTypeId = 1, Code = "TWO_WHEELER", Name = "Two Wheeler / Bike" };
        var vCar = new VehicleType { VehicleTypeId = 2, Code = "CAR", Name = "Hatchback / Sedan Car" };
        var vSUV = new VehicleType { VehicleTypeId = 3, Code = "SUV", Name = "SUV / Large Car" };
        var vVan = new VehicleType { VehicleTypeId = 4, Code = "VAN", Name = "Traveller / Van" };
        var vEV = new VehicleType { VehicleTypeId = 5, Code = "EV", Name = "EV Car Charging Slot" };

        await context.VehicleTypes.AddRangeAsync(vTwoWheeler, vCar, vSUV, vVan, vEV);

        // 6. Sports Types
        var sFootball = new SportsType { SportsTypeId = 1, Name = "Football", Icon = "sports_soccer" };
        var sCricket = new SportsType { SportsTypeId = 2, Name = "Cricket", Icon = "sports_cricket" };
        var sBadminton = new SportsType { SportsTypeId = 3, Name = "Badminton", Icon = "sports_tennis" };
        var sPickleball = new SportsType { SportsTypeId = 4, Name = "Pickleball", Icon = "sports_tennis" };
        var sPadel = new SportsType { SportsTypeId = 5, Name = "Padel", Icon = "sports_tennis" };
        var sTennis = new SportsType { SportsTypeId = 6, Name = "Tennis", Icon = "sports_tennis" };

        await context.SportsTypes.AddRangeAsync(sFootball, sCricket, sBadminton, sPickleball, sPadel, sTennis);

        // 7. Facilities (Kerala Locations)
        var aluvaParking = new Facility
        {
            FacilityId = Guid.Parse("f1111111-1111-1111-1111-111111111111"),
            OwnerId = ownerUser1.UserId,
            FacilityTypeId = typeParking.FacilityTypeId,
            Name = "Aluva Railway Station Premium Parking",
            Description = "Safe, 24/7 guarded private land parking located 350 meters from Aluva Railway Station & Metro. CCTV, night lighting, toilet facilities available.",
            Address = "Station Road, Near Railway Overbridge, Aluva",
            District = "Ernakulam",
            State = "Kerala",
            Country = "India",
            PostalCode = "683101",
            Latitude = 10.1084,
            Longitude = 76.3572,
            Landmark = "350m from Aluva Railway Station",
            Is24Hours = true,
            OpeningTime = new TimeSpan(0, 0, 0),
            ClosingTime = new TimeSpan(23, 59, 59),
            Status = FacilityStatusCode.APPROVED,
            ApprovalStatus = VerificationStatus.APPROVED,
            CommissionRate = 10.0m
        };

        var ernakulamSouthParking = new Facility
        {
            FacilityId = Guid.Parse("f2222222-2222-2222-2222-222222222222"),
            OwnerId = ownerUser1.UserId,
            FacilityTypeId = typeParking.FacilityTypeId,
            Name = "Ernakulam South Station Covered Parking",
            Description = "Covered parking with CCTV surveillance 200m from Ernakulam South Junction station entrance.",
            Address = "South Railway Station Road, Manorama Junction, Ernakulam",
            District = "Ernakulam",
            State = "Kerala",
            Country = "India",
            PostalCode = "682016",
            Latitude = 9.9678,
            Longitude = 76.2917,
            Landmark = "200m from South Railway Station",
            Is24Hours = true,
            OpeningTime = new TimeSpan(0, 0, 0),
            ClosingTime = new TimeSpan(23, 59, 59),
            Status = FacilityStatusCode.APPROVED,
            ApprovalStatus = VerificationStatus.APPROVED,
            CommissionRate = 10.0m
        };

        var kakkanadTurf = new Facility
        {
            FacilityId = Guid.Parse("f3333333-3333-3333-3333-333333333333"),
            OwnerId = ownerUser2.UserId,
            FacilityTypeId = typeSports.FacilityTypeId,
            Name = "ABC Sports Arena Kakkanad",
            Description = "FIFA-approved 7's & 5's football turf with high-lux LED floodlights, changing rooms, and cafeteria.",
            Address = "Infopark Expressway, Near SmartCity, Kakkanad",
            District = "Ernakulam",
            State = "Kerala",
            Country = "India",
            PostalCode = "682030",
            Latitude = 10.0159,
            Longitude = 76.3639,
            Landmark = "Near Infopark Phase 1 Gate",
            Is24Hours = false,
            OpeningTime = new TimeSpan(5, 0, 0), // 05:00 AM
            ClosingTime = new TimeSpan(23, 0, 0), // 11:00 PM
            Status = FacilityStatusCode.APPROVED,
            ApprovalStatus = VerificationStatus.APPROVED,
            CommissionRate = 12.0m
        };

        var kochiPickleball = new Facility
        {
            FacilityId = Guid.Parse("f4444444-4444-4444-4444-444444444444"),
            OwnerId = ownerUser2.UserId,
            FacilityTypeId = typeSports.FacilityTypeId,
            Name = "Kochi Pickleball & Badminton Club",
            Description = "Indoor air-conditioned badminton courts & outdoor pickleball arena in Edappally.",
            Address = "Bypass Road, Edappally, Kochi",
            District = "Ernakulam",
            State = "Kerala",
            Country = "India",
            PostalCode = "682024",
            Latitude = 10.0261,
            Longitude = 76.3089,
            Landmark = "500m from Lulu Mall",
            Is24Hours = false,
            OpeningTime = new TimeSpan(6, 0, 0),
            ClosingTime = new TimeSpan(22, 0, 0),
            Status = FacilityStatusCode.APPROVED,
            ApprovalStatus = VerificationStatus.APPROVED,
            CommissionRate = 10.0m
        };

        await context.Facilities.AddRangeAsync(aluvaParking, ernakulamSouthParking, kakkanadTurf, kochiPickleball);

        // 8. Parking Areas & Capacities
        var aluvaTwoWheelerArea = new ParkingArea
        {
            ParkingAreaId = Guid.NewGuid(),
            FacilityId = aluvaParking.FacilityId,
            VehicleTypeId = vTwoWheeler.VehicleTypeId,
            TotalCapacity = 100,
            PricePerHour = 10.0m,
            PricePerDay = 80.0m,
            PricePerOvernight = 100.0m,
            PricePerMonth = 1500.0m
        };

        var aluvaCarArea = new ParkingArea
        {
            ParkingAreaId = Guid.NewGuid(),
            FacilityId = aluvaParking.FacilityId,
            VehicleTypeId = vCar.VehicleTypeId,
            TotalCapacity = 30,
            PricePerHour = 30.0m,
            PricePerDay = 200.0m,
            PricePerOvernight = 250.0m,
            PricePerMonth = 4000.0m
        };

        var southCarArea = new ParkingArea
        {
            ParkingAreaId = Guid.NewGuid(),
            FacilityId = ernakulamSouthParking.FacilityId,
            VehicleTypeId = vCar.VehicleTypeId,
            TotalCapacity = 40,
            PricePerHour = 35.0m,
            PricePerDay = 220.0m,
            PricePerOvernight = 280.0m,
            PricePerMonth = 4500.0m
        };

        await context.ParkingAreas.AddRangeAsync(aluvaTwoWheelerArea, aluvaCarArea, southCarArea);

        // 9. Sports Resources (Courts & Turfs)
        var footballTurf1 = new Resource
        {
            ResourceId = Guid.NewGuid(),
            FacilityId = kakkanadTurf.FacilityId,
            SportsTypeId = sFootball.SportsTypeId,
            Name = "7's Football Turf 1 (FIFA Turf)",
            Description = "Full size 7-a-side artificial grass ground.",
            Capacity = 14,
            SlotDurationMinutes = 60,
            Status = "ACTIVE"
        };

        var footballTurf2 = new Resource
        {
            ResourceId = Guid.NewGuid(),
            FacilityId = kakkanadTurf.FacilityId,
            SportsTypeId = sFootball.SportsTypeId,
            Name = "5's Football Turf 2",
            Description = "Fast-paced 5-a-side ground with turf shoes available for rent.",
            Capacity = 10,
            SlotDurationMinutes = 60,
            Status = "ACTIVE"
        };

        var badmintonCourt1 = new Resource
        {
            ResourceId = Guid.NewGuid(),
            FacilityId = kochiPickleball.FacilityId,
            SportsTypeId = sBadminton.SportsTypeId,
            Name = "Indoor Wooden Badminton Court 1",
            Description = "BWF Standard synthetic court mat over wooden floor.",
            Capacity = 4,
            SlotDurationMinutes = 60,
            Status = "ACTIVE"
        };

        var pickleballCourt1 = new Resource
        {
            ResourceId = Guid.NewGuid(),
            FacilityId = kochiPickleball.FacilityId,
            SportsTypeId = sPickleball.SportsTypeId,
            Name = "Pickleball Court A",
            Description = "Pro-grade acrylic surface pickleball court with paddles provided.",
            Capacity = 4,
            SlotDurationMinutes = 60,
            Status = "ACTIVE"
        };

        await context.Resources.AddRangeAsync(footballTurf1, footballTurf2, badmintonCourt1, pickleballCourt1);

        // 10. Pricing Rules for Sports Resources
        await context.PricingRules.AddRangeAsync(
            new PricingRule
            {
                PricingRuleId = Guid.NewGuid(),
                FacilityId = kakkanadTurf.FacilityId,
                ResourceId = footballTurf1.ResourceId,
                PricingModel = PricingModelCode.HOURLY,
                PricePerHour = 1200.0m,
                PeakHourPrice = 1600.0m
            },
            new PricingRule
            {
                PricingRuleId = Guid.NewGuid(),
                FacilityId = kochiPickleball.FacilityId,
                ResourceId = badmintonCourt1.ResourceId,
                PricingModel = PricingModelCode.HOURLY,
                PricePerHour = 400.0m,
                PeakHourPrice = 500.0m
            }
        );

        // 11. Initial Sample Booking (Confirmed Parking Booking)
        var sampleBooking = new Booking
        {
            BookingId = Guid.Parse("b1111111-1111-1111-1111-111111111111"),
            BookingNumber = "PARK-20260811-000125",
            UserId = customerUser.UserId,
            FacilityId = aluvaParking.FacilityId,
            BookingType = "PARKING",
            StartDateTime = DateTime.UtcNow.AddHours(-1),
            EndDateTime = DateTime.UtcNow.AddHours(3),
            BookingStatus = BookingStatusCode.CONFIRMED,
            PaymentStatus = PaymentStatusCode.PAID,
            BaseAmount = 120.0m,
            TaxAmount = 0.0m,
            PlatformFee = 10.0m,
            DiscountAmount = 0.0m,
            TotalAmount = 130.0m,
            Currency = "INR",
            QRCodeToken = "QR-PARK-20260811-000125-TOKEN-SECURE",
            CreatedDate = DateTime.UtcNow.AddHours(-1)
        };

        var sampleBookingItem = new BookingItem
        {
            BookingItemId = Guid.NewGuid(),
            BookingId = sampleBooking.BookingId,
            ParkingAreaId = aluvaCarArea.ParkingAreaId,
            VehicleTypeId = vCar.VehicleTypeId,
            VehicleNumber = "KL 07 AB 1234",
            Quantity = 1,
            UnitPrice = 30.0m,
            TotalPrice = 120.0m
        };

        await context.Bookings.AddAsync(sampleBooking);
        await context.BookingItems.AddAsync(sampleBookingItem);

        // 12. Sample Active Coupon
        var firstBookCoupon = new Coupon
        {
            CouponId = Guid.NewGuid(),
            Code = "FIRSTBOOK",
            DiscountType = DiscountType.PERCENTAGE,
            DiscountValue = 10.0m,
            MaxDiscountAmount = 100.0m,
            MinBookingAmount = 200.0m,
            ValidFrom = DateTime.UtcNow.AddDays(-10),
            ValidTo = DateTime.UtcNow.AddMonths(6),
            UsageLimit = 500,
            UserUsageLimit = 1,
            Status = "ACTIVE"
        };

        await context.Coupons.AddAsync(firstBookCoupon);

        await context.SaveChangesAsync();
    }
}
