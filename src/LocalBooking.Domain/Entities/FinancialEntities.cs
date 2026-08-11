using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using LocalBooking.Domain.Enums;

namespace LocalBooking.Domain.Entities;

public class Payment
{
    [Key]
    public Guid PaymentId { get; set; } = Guid.NewGuid();
    public Guid BookingId { get; set; }
    public Booking Booking { get; set; } = null!;

    public string PaymentNumber { get; set; } = string.Empty;
    public string TransactionId { get; set; } = string.Empty;
    public string PaymentGateway { get; set; } = "RAZORPAY"; // RAZORPAY, MOCK
    public string PaymentMethod { get; set; } = "UPI"; // UPI, CARD, NETBANKING
    public decimal Amount { get; set; }
    public string Currency { get; set; } = "INR";
    public PaymentStatusCode Status { get; set; } = PaymentStatusCode.PENDING;
    public string ResponsePayload { get; set; } = string.Empty;
    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;

    public ICollection<Refund> Refunds { get; set; } = new List<Refund>();
}

public class Refund
{
    [Key]
    public Guid RefundId { get; set; } = Guid.NewGuid();
    public Guid BookingId { get; set; }
    public Booking Booking { get; set; } = null!;

    public Guid PaymentId { get; set; }
    public Payment Payment { get; set; } = null!;

    public string RefundNumber { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string Reason { get; set; } = string.Empty;
    public string Status { get; set; } = "COMPLETED";
    public string TransactionId { get; set; } = string.Empty;
    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
}

public class Coupon
{
    [Key]
    public Guid CouponId { get; set; } = Guid.NewGuid();
    public string Code { get; set; } = string.Empty; // e.g. FIRSTBOOK, KERALA50
    public DiscountType DiscountType { get; set; } = DiscountType.PERCENTAGE;
    public decimal DiscountValue { get; set; }
    public decimal MaxDiscountAmount { get; set; }
    public decimal MinBookingAmount { get; set; }
    public DateTime ValidFrom { get; set; }
    public DateTime ValidTo { get; set; }
    public int UsageLimit { get; set; } = 1000;
    public int UserUsageLimit { get; set; } = 1;
    public string Status { get; set; } = "ACTIVE";

    public ICollection<CouponUsage> Usages { get; set; } = new List<CouponUsage>();
}

public class CouponUsage
{
    [Key]
    public Guid UsageId { get; set; } = Guid.NewGuid();
    public Guid CouponId { get; set; }
    public Coupon Coupon { get; set; } = null!;

    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    public Guid BookingId { get; set; }
    public Booking Booking { get; set; } = null!;

    public decimal DiscountAmount { get; set; }
    public DateTime UsedDate { get; set; } = DateTime.UtcNow;
}

public class Settlement
{
    [Key]
    public Guid SettlementId { get; set; } = Guid.NewGuid();
    public Guid OwnerId { get; set; }
    public User Owner { get; set; } = null!;

    public string SettlementNumber { get; set; } = string.Empty;
    public DateTime PeriodStart { get; set; }
    public DateTime PeriodEnd { get; set; }
    public decimal TotalGrossAmount { get; set; }
    public decimal PlatformCommission { get; set; }
    public decimal TotalRefunds { get; set; }
    public decimal NetPayable { get; set; }
    public SettlementStatusCode Status { get; set; } = SettlementStatusCode.PENDING;
    public string PaymentReference { get; set; } = string.Empty;
    public DateTime ProcessedDate { get; set; } = DateTime.UtcNow;

    public ICollection<SettlementItem> Items { get; set; } = new List<SettlementItem>();
}

public class SettlementItem
{
    [Key]
    public Guid ItemId { get; set; } = Guid.NewGuid();
    public Guid SettlementId { get; set; }
    public Settlement Settlement { get; set; } = null!;

    public Guid BookingId { get; set; }
    public Booking Booking { get; set; } = null!;

    public decimal GrossAmount { get; set; }
    public decimal CommissionAmount { get; set; }
    public decimal NetAmount { get; set; }
}
