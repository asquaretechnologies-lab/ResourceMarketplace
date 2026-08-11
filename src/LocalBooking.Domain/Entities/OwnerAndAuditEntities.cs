using System;
using System.ComponentModel.DataAnnotations;
using LocalBooking.Domain.Enums;

namespace LocalBooking.Domain.Entities;

public class OwnerDocument
{
    [Key]
    public Guid DocumentId { get; set; } = Guid.NewGuid();
    public Guid OwnerId { get; set; }
    public User Owner { get; set; } = null!;

    public Guid? FacilityId { get; set; }
    public Facility? Facility { get; set; }

    public DocumentType DocumentType { get; set; } = DocumentType.GOVT_ID;
    public string DocumentUrl { get; set; } = string.Empty;
    public VerificationStatus VerificationStatus { get; set; } = VerificationStatus.PENDING;
    public Guid? VerifiedByUserId { get; set; }
    public string RejectionReason { get; set; } = string.Empty;
    public DateTime UploadedDate { get; set; } = DateTime.UtcNow;
}

public class OwnerBankAccount
{
    [Key]
    public Guid AccountId { get; set; } = Guid.NewGuid();
    public Guid OwnerId { get; set; }
    public User Owner { get; set; } = null!;

    public string BankName { get; set; } = string.Empty;
    public string AccountNumber { get; set; } = string.Empty;
    public string IFSC { get; set; } = string.Empty;
    public string AccountHolderName { get; set; } = string.Empty;
    public bool IsPrimary { get; set; } = true;
    public string Status { get; set; } = "ACTIVE";
}

public class AuditLog
{
    [Key]
    public long LogId { get; set; }
    public Guid? UserId { get; set; }
    public string Action { get; set; } = string.Empty;
    public string EntityType { get; set; } = string.Empty;
    public string EntityId { get; set; } = string.Empty;
    public string OldValue { get; set; } = string.Empty;
    public string NewValue { get; set; } = string.Empty;
    public string IPAddress { get; set; } = string.Empty;
    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
}
