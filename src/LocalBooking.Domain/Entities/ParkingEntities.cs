using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace LocalBooking.Domain.Entities;

public class VehicleType
{
    [Key]
    public int VehicleTypeId { get; set; }
    public string Code { get; set; } = string.Empty; // TWO_WHEELER, CAR, SUV, VAN, EV
    public string Name { get; set; } = string.Empty;

    public ICollection<ParkingArea> ParkingAreas { get; set; } = new List<ParkingArea>();
    public ICollection<BookingItem> BookingItems { get; set; } = new List<BookingItem>();
}

public class ParkingArea
{
    [Key]
    public Guid ParkingAreaId { get; set; } = Guid.NewGuid();
    public Guid FacilityId { get; set; }
    public Facility Facility { get; set; } = null!;

    public int VehicleTypeId { get; set; }
    public VehicleType VehicleType { get; set; } = null!;

    public int TotalCapacity { get; set; }
    public decimal PricePerHour { get; set; }
    public decimal PricePerDay { get; set; }
    public decimal PricePerOvernight { get; set; }
    public decimal PricePerMonth { get; set; }
    public bool UseIndividualSlots { get; set; } = false;
    public string Status { get; set; } = "ACTIVE";

    public ICollection<ParkingSlot> ParkingSlots { get; set; } = new List<ParkingSlot>();
    public ICollection<PricingRule> PricingRules { get; set; } = new List<PricingRule>();
    public ICollection<BookingItem> BookingItems { get; set; } = new List<BookingItem>();
}

public class ParkingSlot
{
    [Key]
    public Guid ParkingSlotId { get; set; } = Guid.NewGuid();
    public Guid ParkingAreaId { get; set; }
    public ParkingArea ParkingArea { get; set; } = null!;

    public string SlotNumber { get; set; } = string.Empty; // CAR-001, BIKE-012
    public string Status { get; set; } = "AVAILABLE"; // AVAILABLE, OCCUPIED, MAINTENANCE
}
