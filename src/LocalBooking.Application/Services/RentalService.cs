using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using LocalBooking.Application.DTOs;
using LocalBooking.Application.Interfaces;
using LocalBooking.Domain.Entities;
using LocalBooking.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace LocalBooking.Application.Services;

public class RentalService : IRentalService
{
    private readonly ILocalBookingDbContext _context;

    public RentalService(ILocalBookingDbContext context)
    {
        _context = context;
    }

    public async Task<List<VehicleModelDto>> GetVehicleModelsAsync()
    {
        return await _context.VehicleModels
            .AsNoTracking()
            .Select(vm => new VehicleModelDto(
                vm.VehicleModelId,
                vm.Category.ToString(),
                vm.Make,
                vm.Model,
                vm.Seats,
                vm.FuelType.ToString(),
                vm.Transmission.ToString(),
                vm.EngineCc
            ))
            .ToListAsync();
    }

    public async Task<List<VehicleDto>> GetOwnerVehiclesAsync(Guid facilityId)
    {
        return await _context.Vehicles
            .AsNoTracking()
            .Where(v => v.FacilityId == facilityId)
            .Include(v => v.VehicleModel)
            .Include(v => v.RentalPlan)
            .Include(v => v.Photos)
            .Select(v => new VehicleDto(
                v.VehicleId,
                v.FacilityId,
                v.VehicleModelId,
                v.VehicleModel.Make,
                v.VehicleModel.Model,
                v.VehicleModel.Category.ToString(),
                v.VehicleModel.Transmission.ToString(),
                v.VehicleModel.FuelType.ToString(),
                v.VehicleModel.Seats,
                v.RentalPlanId,
                v.RentalPlan.Name,
                v.RentalPlan.PricePerDay,
                v.RentalPlan.PricePerHour,
                v.RentalPlan.SecurityDepositAmount,
                v.RegistrationNumber,
                v.Color,
                v.Year,
                v.OdometerKm,
                v.FuelLevelPercent,
                v.Status.ToString(),
                v.InsuranceExpiry,
                v.PollutionExpiry,
                v.PermitExpiry,
                v.IsListedOnline,
                v.Photos.OrderBy(p => p.DisplayOrder).Select(p => p.ImageUrl).ToList()
            ))
            .ToListAsync();
    }

    public async Task<VehicleDto> CreateVehicleAsync(Guid ownerUserId, CreateVehicleRequestDto request)
    {
        var facility = await _context.Facilities.FirstOrDefaultAsync(f => f.FacilityId == request.FacilityId);
        if (facility == null) throw new InvalidOperationException("Rental facility not found.");

        var cleanReg = request.RegistrationNumber.Trim().ToUpperInvariant();
        bool exists = await _context.Vehicles.AnyAsync(v => v.RegistrationNumber == cleanReg);
        if (exists) throw new InvalidOperationException($"Vehicle with registration {cleanReg} is already registered.");

        var vehicle = new Vehicle
        {
            FacilityId = request.FacilityId,
            VehicleModelId = request.VehicleModelId,
            RentalPlanId = request.RentalPlanId,
            RegistrationNumber = cleanReg,
            Color = request.Color,
            Year = request.Year,
            Description = request.Description ?? string.Empty,
            OdometerKm = request.OdometerKm,
            FuelLevelPercent = request.FuelLevelPercent,
            InsuranceExpiry = request.InsuranceExpiry,
            PollutionExpiry = request.PollutionExpiry,
            PermitExpiry = request.PermitExpiry,
            IsListedOnline = request.IsListedOnline,
            Status = VehicleStatus.AVAILABLE
        };

        if (request.PhotoUrls != null)
        {
            int order = 1;
            foreach (var url in request.PhotoUrls.Where(u => !string.IsNullOrWhiteSpace(u)))
            {
                vehicle.Photos.Add(new VehiclePhoto
                {
                    ImageUrl = url,
                    DisplayOrder = order,
                    IsPrimary = order == 1
                });
                order++;
            }
        }

        await _context.Vehicles.AddAsync(vehicle);
        await _context.SaveChangesAsync();

        var model = await _context.VehicleModels.FindAsync(request.VehicleModelId);
        var plan = await _context.RentalPlans.FindAsync(request.RentalPlanId);

        return new VehicleDto(
            vehicle.VehicleId,
            vehicle.FacilityId,
            vehicle.VehicleModelId,
            model?.Make ?? "",
            model?.Model ?? "",
            model?.Category.ToString() ?? "",
            model?.Transmission.ToString() ?? "",
            model?.FuelType.ToString() ?? "",
            model?.Seats ?? 2,
            vehicle.RentalPlanId,
            plan?.Name ?? "",
            plan?.PricePerDay ?? 0,
            plan?.PricePerHour,
            plan?.SecurityDepositAmount ?? 0,
            vehicle.RegistrationNumber,
            vehicle.Color,
            vehicle.Year,
            vehicle.OdometerKm,
            vehicle.FuelLevelPercent,
            vehicle.Status.ToString(),
            vehicle.InsuranceExpiry,
            vehicle.PollutionExpiry,
            vehicle.PermitExpiry,
            vehicle.IsListedOnline,
            vehicle.Photos.Select(p => p.ImageUrl).ToList()
        );
    }

    public async Task<bool> UpdateVehicleStatusAsync(Guid ownerUserId, Guid vehicleId, VehicleStatus status)
    {
        var vehicle = await _context.Vehicles.FindAsync(vehicleId);
        if (vehicle == null) return false;
        vehicle.Status = status;
        vehicle.UpdatedDate = DateTime.UtcNow;
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<List<RentalPlanDto>> GetRentalPlansAsync(Guid facilityId)
    {
        return await _context.RentalPlans
            .AsNoTracking()
            .Where(rp => rp.FacilityId == facilityId && rp.IsActive)
            .Select(rp => new RentalPlanDto(
                rp.RentalPlanId,
                rp.FacilityId,
                rp.Name,
                rp.PricePerHour,
                rp.PricePerDay,
                rp.PricePerWeek,
                rp.MinHours,
                rp.FreeKmPerDay,
                rp.ExtraKmCharge,
                rp.LateFeePerHour,
                rp.GraceMinutes,
                rp.SecurityDepositAmount,
                rp.HelmetIncluded,
                rp.FuelPolicy.ToString(),
                rp.IsActive
            ))
            .ToListAsync();
    }

    public async Task<RentalPlanDto> CreateRentalPlanAsync(Guid ownerUserId, CreateRentalPlanRequestDto request)
    {
        var plan = new RentalPlan
        {
            FacilityId = request.FacilityId,
            Name = request.Name,
            PricePerHour = request.PricePerHour,
            PricePerDay = request.PricePerDay,
            PricePerWeek = request.PricePerWeek,
            MinHours = request.MinHours,
            FreeKmPerDay = request.FreeKmPerDay,
            ExtraKmCharge = request.ExtraKmCharge,
            LateFeePerHour = request.LateFeePerHour,
            GraceMinutes = request.GraceMinutes,
            SecurityDepositAmount = request.SecurityDepositAmount,
            HelmetIncluded = request.HelmetIncluded,
            FuelPolicy = request.FuelPolicy,
            IsActive = true
        };

        await _context.RentalPlans.AddAsync(plan);
        await _context.SaveChangesAsync();

        return new RentalPlanDto(
            plan.RentalPlanId,
            plan.FacilityId,
            plan.Name,
            plan.PricePerHour,
            plan.PricePerDay,
            plan.PricePerWeek,
            plan.MinHours,
            plan.FreeKmPerDay,
            plan.ExtraKmCharge,
            plan.LateFeePerHour,
            plan.GraceMinutes,
            plan.SecurityDepositAmount,
            plan.HelmetIncluded,
            plan.FuelPolicy.ToString(),
            plan.IsActive
        );
    }

    public async Task<List<DriverDto>> GetDriversAsync(Guid facilityId)
    {
        return await _context.Drivers
            .AsNoTracking()
            .Where(d => d.FacilityId == facilityId && d.IsActive)
            .Select(d => new DriverDto(
                d.DriverId,
                d.FacilityId,
                d.Name,
                d.Phone,
                d.LicenceNumber,
                d.LicenceExpiry,
                d.Languages,
                d.ChargePerDay,
                d.NightAllowance,
                d.Status.ToString(),
                d.PhotoUrl,
                d.IsActive
            ))
            .ToListAsync();
    }

    public async Task<DriverDto> CreateDriverAsync(Guid ownerUserId, CreateDriverRequestDto request)
    {
        var driver = new Driver
        {
            FacilityId = request.FacilityId,
            Name = request.Name,
            Phone = request.Phone,
            LicenceNumber = request.LicenceNumber,
            LicenceExpiry = request.LicenceExpiry,
            Languages = request.Languages,
            ChargePerDay = request.ChargePerDay,
            NightAllowance = request.NightAllowance,
            PhotoUrl = request.PhotoUrl ?? string.Empty,
            Status = DriverStatus.AVAILABLE,
            IsActive = true
        };

        await _context.Drivers.AddAsync(driver);
        await _context.SaveChangesAsync();

        return new DriverDto(
            driver.DriverId,
            driver.FacilityId,
            driver.Name,
            driver.Phone,
            driver.LicenceNumber,
            driver.LicenceExpiry,
            driver.Languages,
            driver.ChargePerDay,
            driver.NightAllowance,
            driver.Status.ToString(),
            driver.PhotoUrl,
            driver.IsActive
        );
    }

    public async Task<RenterLookupDto?> LookupRenterByPhoneAsync(Guid facilityId, string phone)
    {
        var cleanPhone = phone.Trim().Replace(" ", "").Replace("-", "");
        var profile = await _context.RenterProfiles
            .Include(p => p.ShopFlags.Where(f => f.FacilityId == facilityId))
            .FirstOrDefaultAsync(p => p.Phone == cleanPhone || p.Phone.EndsWith(cleanPhone));

        if (profile == null) return null;

        var flag = profile.ShopFlags.FirstOrDefault();
        int rentalCount = await _context.RentalAgreements.CountAsync(a => a.RenterProfileId == profile.RenterProfileId);

        return new RenterLookupDto(
            profile.RenterProfileId,
            profile.Phone,
            profile.FullName,
            profile.AlternatePhone,
            profile.Email,
            profile.Nationality,
            profile.HomeAddress,
            profile.LocalStayAddress,
            flag?.IsBlacklisted ?? false,
            flag?.Reason ?? string.Empty,
            rentalCount
        );
    }

    public async Task<BookingResponseDto> CreateWalkInBookingAsync(Guid staffUserId, WalkInBookingRequestDto request)
    {
        if (request.EndDateTime <= request.StartDateTime)
            throw new ArgumentException("End date time must be greater than start date time.");

        var facility = await _context.Facilities.FindAsync(request.FacilityId);
        if (facility == null) throw new InvalidOperationException("Rental shop facility not found.");

        var vehicle = await _context.Vehicles
            .Include(v => v.VehicleModel)
            .Include(v => v.RentalPlan)
            .FirstOrDefaultAsync(v => v.VehicleId == request.VehicleId);

        if (vehicle == null) throw new InvalidOperationException("Selected vehicle not found.");
        if (vehicle.Status != VehicleStatus.AVAILABLE)
            throw new InvalidOperationException($"Vehicle is currently {vehicle.Status} and not available for booking.");

        // Check for double-booking overlap
        bool hasOverlap = await _context.RentalAgreements
            .Include(a => a.Booking)
            .AnyAsync(a => a.VehicleId == vehicle.VehicleId &&
                           a.Booking.BookingStatus != BookingStatusCode.CANCELLED &&
                           a.Booking.BookingStatus != BookingStatusCode.COMPLETED &&
                           a.Booking.BookingStatus != BookingStatusCode.RETURNED &&
                           a.ScheduledPickup < request.EndDateTime &&
                           a.ScheduledReturn > request.StartDateTime);

        if (hasOverlap)
            throw new InvalidOperationException("Vehicle has an active booking that overlaps with requested dates.");

        // Driver validation if requested
        Driver? driver = null;
        if (request.WithDriver)
        {
            if (request.DriverId.HasValue)
            {
                driver = await _context.Drivers.FindAsync(request.DriverId.Value);
                if (driver == null || driver.Status != DriverStatus.AVAILABLE)
                    throw new InvalidOperationException("Selected driver is currently not available.");
            }
            else
            {
                // Auto-pick available driver from facility
                driver = await _context.Drivers.FirstOrDefaultAsync(d => d.FacilityId == request.FacilityId && d.Status == DriverStatus.AVAILABLE && d.IsActive);
            }
        }

        // Renter profile lookup or creation
        var cleanPhone = request.CustomerPhone.Trim().Replace(" ", "").Replace("-", "");
        var renterProfile = await _context.RenterProfiles
            .Include(p => p.ShopFlags.Where(f => f.FacilityId == request.FacilityId))
            .FirstOrDefaultAsync(p => p.Phone == cleanPhone);

        if (renterProfile != null)
        {
            var shopFlag = renterProfile.ShopFlags.FirstOrDefault();
            if (shopFlag?.IsBlacklisted == true)
                throw new InvalidOperationException($"Customer is blacklisted by this shop. Reason: {shopFlag.Reason}");

            renterProfile.FullName = request.CustomerName;
            if (!string.IsNullOrWhiteSpace(request.HomeAddress)) renterProfile.HomeAddress = request.HomeAddress;
            if (!string.IsNullOrWhiteSpace(request.LocalStayAddress)) renterProfile.LocalStayAddress = request.LocalStayAddress;
            if (!string.IsNullOrWhiteSpace(request.CustomerEmail)) renterProfile.Email = request.CustomerEmail;
        }
        else
        {
            renterProfile = new RenterProfile
            {
                FullName = request.CustomerName,
                Phone = cleanPhone,
                AlternatePhone = request.AlternatePhone ?? string.Empty,
                Email = request.CustomerEmail ?? string.Empty,
                HomeAddress = request.HomeAddress ?? string.Empty,
                LocalStayAddress = request.LocalStayAddress ?? string.Empty
            };
            await _context.RenterProfiles.AddAsync(renterProfile);
        }

        // Calculate Pricing
        var plan = vehicle.RentalPlan;
        var duration = request.EndDateTime - request.StartDateTime;
        var totalHours = duration.TotalHours;
        decimal rentAmount;

        if (plan.PricePerHour.HasValue && totalHours < 24 && totalHours >= plan.MinHours)
        {
            rentAmount = (decimal)Math.Ceiling(totalHours) * plan.PricePerHour.Value;
        }
        else
        {
            var grace = plan.GraceMinutes > 0 ? plan.GraceMinutes : 15;
            var billableMinutes = Math.Max(0, duration.TotalMinutes - grace);
            var days = (decimal)Math.Max(1, Math.Ceiling(billableMinutes / (24.0 * 60.0)));
            rentAmount = days * plan.PricePerDay;
        }

        decimal driverAmount = 0;
        if (request.WithDriver && driver != null)
        {
            var grace = plan.GraceMinutes > 0 ? plan.GraceMinutes : 15;
            var billableMinutes = Math.Max(0, duration.TotalMinutes - grace);
            var days = (decimal)Math.Max(1, Math.Ceiling(billableMinutes / (24.0 * 60.0)));
            driverAmount = days * driver.ChargePerDay;
        }

        decimal platformFee = Math.Round(rentAmount * (facility.CommissionRate / 100.0m), 2);
        decimal totalAmount = rentAmount + driverAmount;

        // Generate Booking
        string bookingNumber = $"RENT-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString().Substring(0, 6).ToUpper()}";
        string qrToken = $"QR-{bookingNumber}-{Guid.NewGuid().ToString().Substring(0, 8).ToUpper()}";

        var booking = new Booking
        {
            BookingNumber = bookingNumber,
            FacilityId = request.FacilityId,
            UserId = staffUserId, // Walk-in is recorded by staff
            CreatedByUserId = staffUserId,
            Source = BookingSource.WALK_IN,
            BookingType = "RENTAL",
            StartDateTime = request.StartDateTime,
            EndDateTime = request.EndDateTime,
            BookingStatus = BookingStatusCode.CONFIRMED,
            PaymentStatus = PaymentStatusCode.PAID,
            BaseAmount = rentAmount,
            TaxAmount = 0,
            PlatformFee = platformFee,
            DiscountAmount = 0,
            TotalAmount = totalAmount,
            QRCodeToken = qrToken,
            Notes = request.Notes ?? string.Empty
        };

        var agreement = new RentalAgreement
        {
            Booking = booking,
            VehicleId = vehicle.VehicleId,
            RenterProfile = renterProfile,
            WithDriver = request.WithDriver,
            DriverId = driver?.DriverId,
            PickupMode = request.PickupMode,
            PickupAddress = request.PickupAddress ?? string.Empty,
            DropMode = request.DropMode,
            DropAddress = request.DropAddress ?? string.Empty,
            ScheduledPickup = request.StartDateTime,
            ScheduledReturn = request.EndDateTime,
            HelmetsGiven = request.HelmetsGiven,
            RentAmount = rentAmount,
            DriverAmount = driverAmount,
            PlanSnapshotJson = JsonSerializer.Serialize(new
            {
                plan.Name,
                plan.PricePerHour,
                plan.PricePerDay,
                plan.FreeKmPerDay,
                plan.ExtraKmCharge,
                plan.LateFeePerHour,
                plan.GraceMinutes,
                plan.SecurityDepositAmount,
                plan.FuelPolicy
            })
        };

        // Security Deposit
        decimal depositAmount = request.SecurityDepositAmount > 0 ? request.SecurityDepositAmount : plan.SecurityDepositAmount;
        if (depositAmount > 0)
        {
            agreement.SecurityDeposit = new SecurityDeposit
            {
                Amount = depositAmount,
                CollectedVia = request.DepositPaymentMethod.ToUpperInvariant(),
                CollectedAt = DateTime.UtcNow,
                Status = DepositStatus.HELD
            };
        }

        // Payments: Rent
        var rentPayment = new Payment
        {
            Booking = booking,
            PaymentNumber = $"PAY-{Guid.NewGuid().ToString().Substring(0, 8).ToUpper()}",
            TransactionId = request.UpiReference ?? $"WALKIN-{DateTime.UtcNow.Ticks}",
            PaymentGateway = request.RentPaymentMethod.ToUpperInvariant() == "UPI" ? "UPI_DIRECT" : "CASH",
            PaymentMethod = request.RentPaymentMethod.ToUpperInvariant(),
            Purpose = PaymentPurpose.RENT,
            Amount = totalAmount,
            Currency = "INR",
            Status = PaymentStatusCode.PAID,
            UpiReference = request.UpiReference ?? string.Empty,
            ReceivedByUserId = staffUserId,
            ConfirmedAt = DateTime.UtcNow
        };
        booking.Payments.Add(rentPayment);

        await _context.Bookings.AddAsync(booking);
        await _context.RentalAgreements.AddAsync(agreement);
        await _context.SaveChangesAsync();

        return new BookingResponseDto(
            booking.BookingId,
            booking.BookingNumber,
            facility.FacilityId,
            facility.Name,
            facility.Address,
            booking.BookingType,
            booking.StartDateTime,
            booking.EndDateTime,
            booking.BookingStatus.ToString(),
            booking.PaymentStatus.ToString(),
            booking.BaseAmount,
            booking.TaxAmount,
            booking.PlatformFee,
            booking.DiscountAmount,
            booking.TotalAmount,
            booking.QRCodeToken,
            vehicle.RegistrationNumber,
            $"{vehicle.VehicleModel.Make} {vehicle.VehicleModel.Model} ({vehicle.RegistrationNumber})",
            booking.CreatedDate
        );
    }

    public async Task<TodayBoardResponseDto> GetTodayBoardAsync(Guid facilityId, DateTime? date = null)
    {
        var targetDate = (date ?? DateTime.UtcNow).Date;
        var nextDate = targetDate.AddDays(1);
        var now = DateTime.UtcNow;

        var vehicles = await _context.Vehicles.Where(v => v.FacilityId == facilityId).ToListAsync();
        int totalFleet = vehicles.Count;
        int available = vehicles.Count(v => v.Status == VehicleStatus.AVAILABLE);
        int onRent = vehicles.Count(v => v.Status == VehicleStatus.ON_RENT);
        int maintenance = vehicles.Count(v => v.Status == VehicleStatus.MAINTENANCE);

        var agreements = await _context.RentalAgreements
            .AsNoTracking()
            .Where(a => a.Booking.FacilityId == facilityId)
            .Include(a => a.Booking)
            .Include(a => a.Vehicle).ThenInclude(v => v.VehicleModel)
            .Include(a => a.RenterProfile)
            .Include(a => a.Driver)
            .Include(a => a.SecurityDeposit)
            .ToListAsync();

        var pickupsDue = agreements
            .Where(a => a.Booking.BookingStatus == BookingStatusCode.CONFIRMED &&
                        a.ScheduledPickup >= targetDate && a.ScheduledPickup < nextDate)
            .Select(MapBoardItem)
            .ToList();

        var activeOnRent = agreements
            .Where(a => a.Booking.BookingStatus == BookingStatusCode.ON_RENT)
            .Select(MapBoardItem)
            .ToList();

        var returnsDue = agreements
            .Where(a => (a.Booking.BookingStatus == BookingStatusCode.ON_RENT || a.Booking.BookingStatus == BookingStatusCode.CONFIRMED) &&
                        a.ScheduledReturn >= targetDate && a.ScheduledReturn < nextDate)
            .Select(MapBoardItem)
            .ToList();

        var overdue = agreements
            .Where(a => a.Booking.BookingStatus == BookingStatusCode.ON_RENT &&
                        a.ScheduledReturn < now)
            .Select(a => {
                var item = MapBoardItem(a);
                var diff = (int)(now - a.ScheduledReturn).TotalMinutes;
                return item with { OverdueMinutes = diff };
            })
            .ToList();

        return new TodayBoardResponseDto(
            totalFleet,
            available,
            onRent,
            maintenance,
            pickupsDue,
            activeOnRent,
            returnsDue,
            overdue
        );
    }

    public async Task<bool> ProcessPickupAsync(Guid staffUserId, Guid bookingId, PickupHandoverRequestDto request)
    {
        var booking = await _context.Bookings
            .Include(b => b.RentalAgreement).ThenInclude(a => a!.Vehicle)
            .Include(b => b.RentalAgreement).ThenInclude(a => a!.Driver)
            .FirstOrDefaultAsync(b => b.BookingId == bookingId);

        if (booking?.RentalAgreement == null) return false;

        var agreement = booking.RentalAgreement;
        booking.BookingStatus = BookingStatusCode.ON_RENT;
        agreement.ActualPickup = DateTime.UtcNow;
        agreement.StartOdometer = request.OdometerKm;
        agreement.StartFuelPercent = request.FuelLevelPercent;
        agreement.HelmetsGiven = request.HelmetsGiven;
        agreement.SignatureImageUrl = request.CustomerSignatureUrl ?? string.Empty;

        // Vehicle & Driver status
        agreement.Vehicle.Status = VehicleStatus.ON_RENT;
        agreement.Vehicle.OdometerKm = request.OdometerKm;
        agreement.Vehicle.FuelLevelPercent = request.FuelLevelPercent;

        if (agreement.Driver != null)
        {
            agreement.Driver.Status = DriverStatus.ON_DUTY;
        }

        // Add Inspection record
        var inspection = new VehicleInspection
        {
            RentalAgreementId = agreement.RentalAgreementId,
            Stage = InspectionStage.PICKUP,
            OdometerKm = request.OdometerKm,
            FuelLevelPercent = request.FuelLevelPercent,
            DamageNotes = request.DamageNotes ?? string.Empty,
            PhotoUrls = request.PhotoUrls ?? new List<string>(),
            InspectedByUserId = staffUserId,
            InspectedAt = DateTime.UtcNow
        };
        agreement.Inspections.Add(inspection);

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<ReturnEstimateResponseDto> ProcessReturnInspectionAsync(Guid staffUserId, Guid bookingId, ReturnInspectionRequestDto request)
    {
        var booking = await _context.Bookings
            .Include(b => b.RentalAgreement).ThenInclude(a => a!.Vehicle).ThenInclude(v => v.RentalPlan)
            .Include(b => b.RentalAgreement).ThenInclude(a => a!.Driver)
            .Include(b => b.RentalAgreement).ThenInclude(a => a!.SecurityDeposit)
            .FirstOrDefaultAsync(b => b.BookingId == bookingId);

        if (booking?.RentalAgreement == null)
            throw new InvalidOperationException("Rental booking not found.");

        var agreement = booking.RentalAgreement;
        var plan = agreement.Vehicle.RentalPlan;

        int startOdo = agreement.StartOdometer ?? agreement.Vehicle.OdometerKm;
        int endOdo = request.OdometerKm;
        int totalKm = Math.Max(0, endOdo - startOdo);

        var totalHours = (agreement.ScheduledReturn - agreement.ScheduledPickup).TotalHours;
        var rentalDays = (int)Math.Max(1, Math.Ceiling(totalHours / 24.0));

        int? freeKm = plan.FreeKmPerDay.HasValue ? plan.FreeKmPerDay.Value * rentalDays : null;
        int extraKm = 0;
        decimal extraKmCharge = 0;
        if (freeKm.HasValue && totalKm > freeKm.Value)
        {
            extraKm = totalKm - freeKm.Value;
            extraKmCharge = extraKm * plan.ExtraKmCharge;
        }

        // Late fee calculation
        var now = DateTime.UtcNow;
        var graceEnd = agreement.ScheduledReturn.AddMinutes(plan.GraceMinutes);
        int overtimeHours = 0;
        decimal lateFee = 0;
        if (now > graceEnd)
        {
            overtimeHours = (int)Math.Ceiling((now - agreement.ScheduledReturn).TotalHours);
            lateFee = overtimeHours * plan.LateFeePerHour;
        }

        // Fuel penalty (if returned with lower fuel than start)
        decimal fuelPenalty = 0;
        int startFuel = agreement.StartFuelPercent ?? 100;
        if (request.FuelLevelPercent < startFuel)
        {
            int deficit = startFuel - request.FuelLevelPercent;
            // standard Kerala market penalty rate approx ₹30 per 10% fuel deficit
            fuelPenalty = Math.Round((deficit / 10.0m) * 35.0m, 2);
        }

        decimal totalExtra = extraKmCharge + lateFee + fuelPenalty;
        decimal depositHeld = agreement.SecurityDeposit?.Amount ?? 0;
        decimal net = depositHeld - totalExtra;

        // Store temporary end readings on agreement & inspection
        agreement.ActualReturn = now;
        agreement.EndOdometer = endOdo;
        agreement.EndFuelPercent = request.FuelLevelPercent;
        booking.BookingStatus = BookingStatusCode.RETURNED;

        agreement.Vehicle.Status = VehicleStatus.AVAILABLE;
        agreement.Vehicle.OdometerKm = endOdo;
        agreement.Vehicle.FuelLevelPercent = request.FuelLevelPercent;

        if (agreement.Driver != null)
        {
            agreement.Driver.Status = DriverStatus.AVAILABLE;
        }

        var inspection = new VehicleInspection
        {
            RentalAgreementId = agreement.RentalAgreementId,
            Stage = InspectionStage.RETURN,
            OdometerKm = request.OdometerKm,
            FuelLevelPercent = request.FuelLevelPercent,
            DamageNotes = request.DamageNotes ?? string.Empty,
            PhotoUrls = request.PhotoUrls ?? new List<string>(),
            InspectedByUserId = staffUserId,
            InspectedAt = now
        };
        agreement.Inspections.Add(inspection);

        await _context.SaveChangesAsync();

        return new ReturnEstimateResponseDto(
            agreement.RentalAgreementId,
            startOdo,
            endOdo,
            totalKm,
            freeKm,
            extraKm,
            extraKmCharge,
            (int)totalHours,
            (int)Math.Ceiling((now - (agreement.ActualPickup ?? agreement.ScheduledPickup)).TotalHours),
            overtimeHours,
            lateFee,
            fuelPenalty,
            0,
            totalExtra,
            depositHeld,
            Math.Abs(net),
            net >= 0
        );
    }

    public async Task<bool> SettleRentalAsync(Guid staffUserId, Guid bookingId, SettleRentalRequestDto request)
    {
        var booking = await _context.Bookings
            .Include(b => b.RentalAgreement).ThenInclude(a => a!.SecurityDeposit)
            .Include(b => b.RentalAgreement).ThenInclude(a => a!.Charges)
            .FirstOrDefaultAsync(b => b.BookingId == bookingId);

        if (booking?.RentalAgreement == null) return false;

        var agreement = booking.RentalAgreement;

        // Add charges
        if (request.ExtraKmCharge > 0)
            agreement.Charges.Add(new RentalCharge { RentalAgreementId = agreement.RentalAgreementId, Type = RentalChargeType.EXTRA_KM, Description = "Extra Kilometers Run", Amount = request.ExtraKmCharge });

        if (request.LateFeeCharge > 0)
            agreement.Charges.Add(new RentalCharge { RentalAgreementId = agreement.RentalAgreementId, Type = RentalChargeType.LATE_RETURN, Description = "Late Return Penalty", Amount = request.LateFeeCharge });

        if (request.FuelCharge > 0)
            agreement.Charges.Add(new RentalCharge { RentalAgreementId = agreement.RentalAgreementId, Type = RentalChargeType.FUEL, Description = "Fuel Level Deficit", Amount = request.FuelCharge });

        if (request.DamageCharge > 0)
            agreement.Charges.Add(new RentalCharge { RentalAgreementId = agreement.RentalAgreementId, Type = RentalChargeType.DAMAGE, Description = "Minor Damage Deduction", Amount = request.DamageCharge });

        if (request.OtherCharges > 0)
            agreement.Charges.Add(new RentalCharge { RentalAgreementId = agreement.RentalAgreementId, Type = RentalChargeType.OTHER, Description = request.OtherChargesNotes ?? "Incidental Charges", Amount = request.OtherCharges });

        // Update Security Deposit settlement
        if (agreement.SecurityDeposit != null)
        {
            agreement.SecurityDeposit.DeductedAmount = request.DepositDeducted;
            agreement.SecurityDeposit.RefundedAmount = request.DepositRefunded;
            agreement.SecurityDeposit.RefundedVia = request.RefundMethod.ToUpperInvariant();
            agreement.SecurityDeposit.RefundedAt = DateTime.UtcNow;
            agreement.SecurityDeposit.Status = request.DepositDeducted > 0
                ? (request.DepositRefunded > 0 ? DepositStatus.PARTIALLY_REFUNDED : DepositStatus.FORFEITED)
                : DepositStatus.REFUNDED;
        }

        booking.BookingStatus = BookingStatusCode.COMPLETED;
        booking.UpdatedDate = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<DailyRentalReportDto> GetDailyReportAsync(Guid facilityId, DateTime date)
    {
        var dayStart = date.Date;
        var dayEnd = dayStart.AddDays(1);

        var bookings = await _context.Bookings
            .AsNoTracking()
            .Where(b => b.FacilityId == facilityId && b.BookingType == "RENTAL")
            .Include(b => b.RentalAgreement).ThenInclude(a => a!.SecurityDeposit)
            .Include(b => b.Payments)
            .ToListAsync();

        var dayPayments = bookings
            .SelectMany(b => b.Payments)
            .Where(p => p.CreatedDate >= dayStart && p.CreatedDate < dayEnd && p.Status == PaymentStatusCode.PAID)
            .ToList();

        decimal rentCollected = dayPayments.Where(p => p.Purpose == PaymentPurpose.RENT).Sum(p => p.Amount);
        decimal cashCollected = dayPayments.Where(p => p.PaymentMethod == "CASH").Sum(p => p.Amount);
        decimal upiCollected = dayPayments.Where(p => p.PaymentMethod == "UPI").Sum(p => p.Amount);

        var deposits = bookings
            .Where(b => b.RentalAgreement?.SecurityDeposit != null)
            .Select(b => b.RentalAgreement!.SecurityDeposit!)
            .ToList();

        decimal depositsHeld = deposits.Where(d => d.CollectedAt >= dayStart && d.CollectedAt < dayEnd).Sum(d => d.Amount);
        decimal depositsRefunded = deposits.Where(d => d.RefundedAt >= dayStart && d.RefundedAt < dayEnd).Sum(d => d.RefundedAmount);

        int totalBookings = bookings.Count(b => b.CreatedDate >= dayStart && b.CreatedDate < dayEnd);
        int totalPickups = bookings.Count(b => b.RentalAgreement?.ActualPickup >= dayStart && b.RentalAgreement?.ActualPickup < dayEnd);
        int totalReturns = bookings.Count(b => b.RentalAgreement?.ActualReturn >= dayStart && b.RentalAgreement?.ActualReturn < dayEnd);

        return new DailyRentalReportDto(
            dayStart,
            totalBookings,
            totalPickups,
            totalReturns,
            rentCollected,
            cashCollected,
            upiCollected,
            depositsHeld,
            depositsRefunded,
            0
        );
    }

    private static RentalBoardItemDto MapBoardItem(RentalAgreement a)
    {
        return new RentalBoardItemDto(
            a.Booking.BookingId,
            a.RentalAgreementId,
            a.Booking.BookingNumber,
            a.VehicleId,
            $"{a.Vehicle.VehicleModel.Make} {a.Vehicle.VehicleModel.Model}",
            a.Vehicle.RegistrationNumber,
            a.Vehicle.VehicleModel.Category.ToString(),
            a.RenterProfile.FullName,
            a.RenterProfile.Phone,
            a.ScheduledPickup,
            a.ScheduledReturn,
            a.ActualPickup,
            a.ActualReturn,
            a.Booking.BookingStatus.ToString(),
            a.Booking.PaymentStatus.ToString(),
            a.Booking.TotalAmount,
            a.SecurityDeposit?.Amount ?? 0,
            a.WithDriver,
            a.Driver?.Name,
            null
        );
    }
}
