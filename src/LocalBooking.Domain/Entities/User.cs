using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using LocalBooking.Domain.Enums;

namespace LocalBooking.Domain.Entities;

public class Role
{
    [Key]
    public int RoleId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;

    public ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
}

public class User
{
    [Key]
    public Guid UserId { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public string Mobile { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public UserType UserType { get; set; } = UserType.CUSTOMER;
    public UserStatus Status { get; set; } = UserStatus.ACTIVE;
    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedDate { get; set; } = DateTime.UtcNow;

    public ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
    public ICollection<Facility> OwnedFacilities { get; set; } = new List<Facility>();
    public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
    public ICollection<OwnerDocument> OwnerDocuments { get; set; } = new List<OwnerDocument>();
    public ICollection<OwnerBankAccount> BankAccounts { get; set; } = new List<OwnerBankAccount>();
    public ICollection<Settlement> Settlements { get; set; } = new List<Settlement>();
}

public class UserRole
{
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    public int RoleId { get; set; }
    public Role Role { get; set; } = null!;
}
