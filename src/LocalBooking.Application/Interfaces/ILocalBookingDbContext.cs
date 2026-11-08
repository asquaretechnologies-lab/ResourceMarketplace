using System.Threading;
using System.Threading.Tasks;
using LocalBooking.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage;

namespace LocalBooking.Application.Interfaces;

public interface ILocalBookingDbContext
{
    DbSet<User> Users { get; }
    DbSet<Role> Roles { get; }
    DbSet<UserRole> UserRoles { get; }
    DbSet<FacilityType> FacilityTypes { get; }
    DbSet<Facility> Facilities { get; }
    DbSet<FacilityPhoto> FacilityPhotos { get; }
    DbSet<Feature> Features { get; }
    DbSet<FacilityFeature> FacilityFeatures { get; }
    DbSet<SportsType> SportsTypes { get; }
    DbSet<Resource> Resources { get; }
    DbSet<VehicleType> VehicleTypes { get; }
    DbSet<ParkingArea> ParkingAreas { get; }
    DbSet<ParkingSlot> ParkingSlots { get; }
    DbSet<PricingRule> PricingRules { get; }
    DbSet<BlockedPeriod> BlockedPeriods { get; }
    DbSet<Booking> Bookings { get; }
    DbSet<BookingItem> BookingItems { get; }
    DbSet<BookingCheckIn> BookingCheckIns { get; }
    DbSet<Payment> Payments { get; }
    DbSet<Refund> Refunds { get; }
    DbSet<Coupon> Coupons { get; }
    DbSet<CouponUsage> CouponUsages { get; }
    DbSet<Settlement> Settlements { get; }
    DbSet<SettlementItem> SettlementItems { get; }
    DbSet<Review> Reviews { get; }
    DbSet<ReviewPhoto> ReviewPhotos { get; }
    DbSet<Notification> Notifications { get; }
    DbSet<OwnerDocument> OwnerDocuments { get; }
    DbSet<OwnerBankAccount> OwnerBankAccounts { get; }
    DbSet<AuditLog> AuditLogs { get; }

    // Vehicle Rentals
    DbSet<VehicleModel> VehicleModels { get; }
    DbSet<RentalPlan> RentalPlans { get; }
    DbSet<Vehicle> Vehicles { get; }
    DbSet<VehiclePhoto> VehiclePhotos { get; }
    DbSet<VehicleMaintenance> VehicleMaintenances { get; }
    DbSet<Driver> Drivers { get; }
    DbSet<RenterProfile> RenterProfiles { get; }
    DbSet<RenterDocument> RenterDocuments { get; }
    DbSet<ShopRenterFlag> ShopRenterFlags { get; }
    DbSet<RentalAgreement> RentalAgreements { get; }
    DbSet<VehicleInspection> VehicleInspections { get; }
    DbSet<RentalCharge> RentalCharges { get; }
    DbSet<SecurityDeposit> SecurityDeposits { get; }

    DatabaseFacade Database { get; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
