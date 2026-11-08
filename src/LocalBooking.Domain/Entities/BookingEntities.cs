using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using LocalBooking.Domain.Enums;

namespace LocalBooking.Domain.Entities;

public class Booking
{
    public Guid BookingId { get; set; } = Guid.NewGuid();
    public string BookingNumber { get; set; } = string.Empty; // e.g. PARK-20260811-000125 / SPORT-20260811-000412

    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    public Guid FacilityId { get; set; }
    public Facility Facility { get; set; } = null!;

    public string BookingType { get; set; } = "SPORTS"; // SPORTS, PARKING, RENTAL

    /// <summary>ONLINE (customer booked) or WALK_IN (staff entered). For walk-ins, UserId is the staff user and the customer is in RentalAgreement.RenterProfile.</summary>
    public BookingSource Source { get; set; } = BookingSource.ONLINE;
    public Guid? CreatedByUserId { get; set; }
    public string Notes { get; set; } = string.Empty;

    public DateTime StartDateTime { get; set; }
    public DateTime EndDateTime { get; set; }

    public BookingStatusCode BookingStatus { get; set; } = BookingStatusCode.PENDING;
    public PaymentStatusCode PaymentStatus { get; set; } = PaymentStatusCode.PENDING;

    public decimal BaseAmount { get; set; }
    public decimal TaxAmount { get; set; }
    public decimal PlatformFee { get; set; }
    public decimal DiscountAmount { get; set; }
    public decimal TotalAmount { get; set; }
    public string Currency { get; set; } = "INR";

    public string QRCodeToken { get; set; } = string.Empty;
    public int GracePeriodMinutes { get; set; } = 30;

    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedDate { get; set; } = DateTime.UtcNow;

    public ICollection<BookingItem> BookingItems { get; set; } = new List<BookingItem>();
    public BookingCheckIn? CheckInRecord { get; set; }
    public ICollection<Payment> Payments { get; set; } = new List<Payment>();
    public ICollection<Refund> Refunds { get; set; } = new List<Refund>();
    public Review? Review { get; set; }
    public RentalAgreement? RentalAgreement { get; set; }
}

public class BookingItem
{
    public Guid BookingItemId { get; set; } = Guid.NewGuid();
    public Guid BookingId { get; set; }
    public Booking Booking { get; set; } = null!;

    public Guid? ResourceId { get; set; }
    public Resource? Resource { get; set; }

    public Guid? ParkingAreaId { get; set; }
    public ParkingArea? ParkingArea { get; set; }

    public int? VehicleTypeId { get; set; }
    public VehicleType? VehicleType { get; set; }

    public string VehicleNumber { get; set; } = string.Empty; // KL 07 AB 1234
    public int Quantity { get; set; } = 1;
    public decimal UnitPrice { get; set; }
    public decimal TotalPrice { get; set; }
}

public class BookingCheckIn
{
    [Key]
    public Guid CheckInId { get; set; } = Guid.NewGuid();
    public Guid BookingId { get; set; }
    public Booking Booking { get; set; } = null!;

    public DateTime? CheckedInTime { get; set; }
    public Guid? CheckedInByUserId { get; set; }

    public DateTime? CheckedOutTime { get; set; }
    public Guid? CheckedOutByUserId { get; set; }

    public int OvertimeMinutes { get; set; } = 0;
    public decimal AdditionalCharge { get; set; } = 0;
    public PaymentStatusCode AdditionalPaymentStatus { get; set; } = PaymentStatusCode.PAID;
}
