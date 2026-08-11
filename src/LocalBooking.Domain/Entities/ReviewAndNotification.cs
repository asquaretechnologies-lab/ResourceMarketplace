using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace LocalBooking.Domain.Entities;

public class Review
{
    [Key]
    public Guid ReviewId { get; set; } = Guid.NewGuid();
    public Guid BookingId { get; set; }
    public Booking Booking { get; set; } = null!;

    public Guid FacilityId { get; set; }
    public Facility Facility { get; set; } = null!;

    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    public int Rating { get; set; } // 1 to 5 stars
    public int CleanlinessRating { get; set; }
    public int SecurityRating { get; set; }
    public int ServiceRating { get; set; }
    public int AccessibilityRating { get; set; }

    public string Comment { get; set; } = string.Empty;
    public string Status { get; set; } = "PUBLISHED";
    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;

    public ICollection<ReviewPhoto> Photos { get; set; } = new List<ReviewPhoto>();
}

public class ReviewPhoto
{
    [Key]
    public Guid PhotoId { get; set; } = Guid.NewGuid();
    public Guid ReviewId { get; set; }
    public Review Review { get; set; } = null!;
    public string ImageUrl { get; set; } = string.Empty;
}

public class Notification
{
    [Key]
    public Guid NotificationId { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string Type { get; set; } = "BOOKING_CONFIRMED";
    public bool IsRead { get; set; } = false;
    public DateTime SentDate { get; set; } = DateTime.UtcNow;
}
