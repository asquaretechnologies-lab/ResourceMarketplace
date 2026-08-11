using System;
using System.ComponentModel.DataAnnotations;
using LocalBooking.Domain.Enums;

namespace LocalBooking.Domain.Entities;

public class PricingRule
{
    [Key]
    public Guid PricingRuleId { get; set; } = Guid.NewGuid();
    public Guid FacilityId { get; set; }
    public Facility Facility { get; set; } = null!;

    public Guid? ResourceId { get; set; }
    public Resource? Resource { get; set; }

    public Guid? ParkingAreaId { get; set; }
    public ParkingArea? ParkingArea { get; set; }

    public PricingModelCode PricingModel { get; set; } = PricingModelCode.HOURLY;
    public decimal PricePerHour { get; set; }
    public decimal PricePerDay { get; set; }
    public decimal PricePerOvernight { get; set; }
    public decimal PricePerMonth { get; set; }

    public decimal WeekdayMultiplier { get; set; } = 1.0m;
    public decimal WeekendMultiplier { get; set; } = 1.0m;
    public decimal PeakHourPrice { get; set; }

    public DateTime? EffectiveStartDate { get; set; }
    public DateTime? EffectiveEndDate { get; set; }
}

public class BlockedPeriod
{
    [Key]
    public Guid BlockedPeriodId { get; set; } = Guid.NewGuid();
    public Guid FacilityId { get; set; }
    public Facility Facility { get; set; } = null!;

    public Guid? ResourceId { get; set; }
    public Resource? Resource { get; set; }

    public Guid? ParkingAreaId { get; set; }
    public ParkingArea? ParkingArea { get; set; }

    public DateTime StartDateTime { get; set; }
    public DateTime EndDateTime { get; set; }
    public string Reason { get; set; } = string.Empty;

    public Guid CreatedBy { get; set; }
}
