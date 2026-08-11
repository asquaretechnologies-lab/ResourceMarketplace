using LocalBooking.Application.Interfaces;
using LocalBooking.Domain.Entities;
using LocalBooking.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace LocalBooking.Infrastructure.Data;

public class LocalBookingDbContext : DbContext, ILocalBookingDbContext
{
    public LocalBookingDbContext(DbContextOptions<LocalBookingDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<Role> Roles => Set<Role>();
    public DbSet<UserRole> UserRoles => Set<UserRole>();
    public DbSet<FacilityType> FacilityTypes => Set<FacilityType>();
    public DbSet<Facility> Facilities => Set<Facility>();
    public DbSet<FacilityPhoto> FacilityPhotos => Set<FacilityPhoto>();
    public DbSet<Feature> Features => Set<Feature>();
    public DbSet<FacilityFeature> FacilityFeatures => Set<FacilityFeature>();
    public DbSet<SportsType> SportsTypes => Set<SportsType>();
    public DbSet<Resource> Resources => Set<Resource>();
    public DbSet<VehicleType> VehicleTypes => Set<VehicleType>();
    public DbSet<ParkingArea> ParkingAreas => Set<ParkingArea>();
    public DbSet<ParkingSlot> ParkingSlots => Set<ParkingSlot>();
    public DbSet<PricingRule> PricingRules => Set<PricingRule>();
    public DbSet<BlockedPeriod> BlockedPeriods => Set<BlockedPeriod>();
    public DbSet<Booking> Bookings => Set<Booking>();
    public DbSet<BookingItem> BookingItems => Set<BookingItem>();
    public DbSet<BookingCheckIn> BookingCheckIns => Set<BookingCheckIn>();
    public DbSet<Payment> Payments => Set<Payment>();
    public DbSet<Refund> Refunds => Set<Refund>();
    public DbSet<Coupon> Coupons => Set<Coupon>();
    public DbSet<CouponUsage> CouponUsages => Set<CouponUsage>();
    public DbSet<Settlement> Settlements => Set<Settlement>();
    public DbSet<SettlementItem> SettlementItems => Set<SettlementItem>();
    public DbSet<Review> Reviews => Set<Review>();
    public DbSet<ReviewPhoto> ReviewPhotos => Set<ReviewPhoto>();
    public DbSet<Notification> Notifications => Set<Notification>();
    public DbSet<OwnerDocument> OwnerDocuments => Set<OwnerDocument>();
    public DbSet<OwnerBankAccount> OwnerBankAccounts => Set<OwnerBankAccount>();
    public DbSet<AuditLog> AuditLogs => Set<AuditLog>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Convert table & column names to PostgreSQL snake_case conventions
        foreach (var entity in modelBuilder.Model.GetEntityTypes())
        {
            entity.SetTableName(ToSnakeCase(entity.GetTableName()!));
            foreach (var property in entity.GetProperties())
            {
                property.SetColumnName(ToSnakeCase(property.GetColumnName()));
            }
            foreach (var key in entity.GetKeys())
            {
                key.SetName(ToSnakeCase(key.GetName()!));
            }
            foreach (var fk in entity.GetForeignKeys())
            {
                fk.SetConstraintName(ToSnakeCase(fk.GetConstraintName()!));
            }
            foreach (var index in entity.GetIndexes())
            {
                var dbName = index.GetDatabaseName();
                if (!string.IsNullOrEmpty(dbName))
                {
                    index.SetDatabaseName(ToSnakeCase(dbName));
                }
            }
        }

        // Composite Keys
        modelBuilder.Entity<UserRole>().HasKey(ur => new { ur.UserId, ur.RoleId });
        modelBuilder.Entity<FacilityFeature>().HasKey(ff => new { ff.FacilityId, ff.FeatureId });

        // Unique Constraints & Indexes
        modelBuilder.Entity<User>().HasIndex(u => u.Email).IsUnique();
        modelBuilder.Entity<User>().HasIndex(u => u.Mobile).IsUnique();
        modelBuilder.Entity<FacilityType>().HasIndex(ft => ft.Code).IsUnique();
        modelBuilder.Entity<SportsType>().HasIndex(st => st.Name).IsUnique();
        modelBuilder.Entity<VehicleType>().HasIndex(vt => vt.Code).IsUnique();
        modelBuilder.Entity<Coupon>().HasIndex(c => c.Code).IsUnique();
        modelBuilder.Entity<Booking>().HasIndex(b => b.BookingNumber).IsUnique();
        modelBuilder.Entity<Booking>().HasIndex(b => b.QRCodeToken).IsUnique();

        // Facility Coordinates Index & Status Index
        modelBuilder.Entity<Facility>().HasIndex(f => new { f.Latitude, f.Longitude });
        modelBuilder.Entity<Facility>().HasIndex(f => new { f.FacilityTypeId, f.Status, f.ApprovalStatus });

        // Parking Area Unique Constraint: Facility + VehicleType
        modelBuilder.Entity<ParkingArea>().HasIndex(pa => new { pa.FacilityId, pa.VehicleTypeId }).IsUnique();

        // Booking Index for Availability & Overlap Queries
        modelBuilder.Entity<Booking>().HasIndex(b => new { b.FacilityId, b.StartDateTime, b.EndDateTime, b.BookingStatus });

        // Enums String Conversions
        modelBuilder.Entity<User>()
            .Property(u => u.UserType)
            .HasConversion<string>();

        modelBuilder.Entity<User>()
            .Property(u => u.Status)
            .HasConversion<string>();

        modelBuilder.Entity<Facility>()
            .Property(f => f.Status)
            .HasConversion<string>();

        modelBuilder.Entity<Facility>()
            .Property(f => f.ApprovalStatus)
            .HasConversion<string>();

        modelBuilder.Entity<Booking>()
            .Property(b => b.BookingStatus)
            .HasConversion<string>();

        modelBuilder.Entity<Booking>()
            .Property(b => b.PaymentStatus)
            .HasConversion<string>();

        modelBuilder.Entity<Payment>()
            .Property(p => p.Status)
            .HasConversion<string>();

        modelBuilder.Entity<PricingRule>()
            .Property(pr => pr.PricingModel)
            .HasConversion<string>();

        modelBuilder.Entity<Coupon>()
            .Property(c => c.DiscountType)
            .HasConversion<string>();

        modelBuilder.Entity<Settlement>()
            .Property(s => s.Status)
            .HasConversion<string>();

        modelBuilder.Entity<OwnerDocument>()
            .Property(d => d.DocumentType)
            .HasConversion<string>();

        modelBuilder.Entity<OwnerDocument>()
            .Property(d => d.VerificationStatus)
            .HasConversion<string>();
    }

    private static string ToSnakeCase(string name)
    {
        if (string.IsNullOrEmpty(name)) return name;
        return string.Concat(name.Select((x, i) =>
            i > 0 && char.IsUpper(x) ? "_" + x.ToString() : x.ToString())).ToLower();
    }
}
