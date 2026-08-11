using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace LocalBooking.Domain.Entities;

public class SportsType
{
    [Key]
    public int SportsTypeId { get; set; }
    public string Name { get; set; } = string.Empty; // Football, Cricket, Badminton, Pickleball, Padel, Tennis...
    public string Icon { get; set; } = string.Empty;

    public ICollection<Resource> Resources { get; set; } = new List<Resource>();
}

public class Resource
{
    [Key]
    public Guid ResourceId { get; set; } = Guid.NewGuid();
    public Guid FacilityId { get; set; }
    public Facility Facility { get; set; } = null!;

    public int? SportsTypeId { get; set; }
    public SportsType? SportsType { get; set; }

    public string Name { get; set; } = string.Empty; // e.g. Football Turf 1, Court 2
    public string Description { get; set; } = string.Empty;
    public int Capacity { get; set; } = 1;
    public int SlotDurationMinutes { get; set; } = 60;
    public string Status { get; set; } = "ACTIVE"; // ACTIVE, MAINTENANCE, INACTIVE
    public bool UseIndividualSlots { get; set; } = false;

    public ICollection<PricingRule> PricingRules { get; set; } = new List<PricingRule>();
    public ICollection<BlockedPeriod> BlockedPeriods { get; set; } = new List<BlockedPeriod>();
    public ICollection<BookingItem> BookingItems { get; set; } = new List<BookingItem>();
}
