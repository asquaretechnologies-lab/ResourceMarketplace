using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using LocalBooking.Domain.Enums;

namespace LocalBooking.Domain.Entities;

public class FacilityType
{
    [Key]
    public int FacilityTypeId { get; set; }
    public string Code { get; set; } = string.Empty; // SPORTS, PARKING, EV_CHARGING
    public string Name { get; set; } = string.Empty;
    public string Icon { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;

    public ICollection<Facility> Facilities { get; set; } = new List<Facility>();
    public ICollection<Feature> Features { get; set; } = new List<Feature>();
}

public class Facility
{
    [Key]
    public Guid FacilityId { get; set; } = Guid.NewGuid();
    public Guid OwnerId { get; set; }
    public User Owner { get; set; } = null!;

    public int FacilityTypeId { get; set; }
    public FacilityType FacilityType { get; set; } = null!;

    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string District { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public string Country { get; set; } = "India";
    public string PostalCode { get; set; } = string.Empty;

    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public string Landmark { get; set; } = string.Empty;

    public bool Is24Hours { get; set; } = false;
    public TimeSpan OpeningTime { get; set; } = new TimeSpan(6, 0, 0); // 06:00 AM
    public TimeSpan ClosingTime { get; set; } = new TimeSpan(22, 0, 0); // 10:00 PM

    public FacilityStatusCode Status { get; set; } = FacilityStatusCode.DRAFT;
    public VerificationStatus ApprovalStatus { get; set; } = VerificationStatus.PENDING;
    public decimal CommissionRate { get; set; } = 10.0m; // Default 10% platform fee

    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedDate { get; set; } = DateTime.UtcNow;

    public ICollection<FacilityPhoto> Photos { get; set; } = new List<FacilityPhoto>();
    public ICollection<FacilityFeature> FacilityFeatures { get; set; } = new List<FacilityFeature>();
    public ICollection<Resource> Resources { get; set; } = new List<Resource>();
    public ICollection<ParkingArea> ParkingAreas { get; set; } = new List<ParkingArea>();
    public ICollection<PricingRule> PricingRules { get; set; } = new List<PricingRule>();
    public ICollection<BlockedPeriod> BlockedPeriods { get; set; } = new List<BlockedPeriod>();
    public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
    public ICollection<Review> Reviews { get; set; } = new List<Review>();
}

public class FacilityPhoto
{
    [Key]
    public Guid PhotoId { get; set; } = Guid.NewGuid();
    public Guid FacilityId { get; set; }
    public Facility Facility { get; set; } = null!;
    public string ImageUrl { get; set; } = string.Empty;
    public int DisplayOrder { get; set; }
    public bool IsPrimary { get; set; } = false;
    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
}

public class Feature
{
    [Key]
    public int FeatureId { get; set; }
    public int FacilityTypeId { get; set; }
    public FacilityType FacilityType { get; set; } = null!;
    public string Name { get; set; } = string.Empty;
    public string Icon { get; set; } = string.Empty;

    public ICollection<FacilityFeature> FacilityFeatures { get; set; } = new List<FacilityFeature>();
}

public class FacilityFeature
{
    public Guid FacilityId { get; set; }
    public Facility Facility { get; set; } = null!;

    public int FeatureId { get; set; }
    public Feature Feature { get; set; } = null!;
}
