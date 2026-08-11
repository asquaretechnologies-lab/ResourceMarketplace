using LocalBooking.Domain.Enums;

namespace LocalBooking.Application.DTOs;

public record RegisterRequestDto(
    string Name,
    string Email,
    string Mobile,
    string Password,
    UserType UserType = UserType.CUSTOMER
);

public record LoginRequestDto(
    string EmailOrMobile,
    string Password
);

public record AuthResponseDto(
    bool Success,
    string Message,
    string? Token,
    string? RefreshToken,
    UserDto? User
);

public record UserDto(
    string UserId,
    string Name,
    string Email,
    string Mobile,
    string UserType,
    string Status
);
