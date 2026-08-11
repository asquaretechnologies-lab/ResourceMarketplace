using System;
using System.Threading.Tasks;
using LocalBooking.Application.DTOs;
using LocalBooking.Application.Interfaces;
using LocalBooking.Domain.Entities;
using LocalBooking.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace LocalBooking.Application.Services;

public class AuthService : IAuthService
{
    private readonly ILocalBookingDbContext _dbContext;
    private readonly IJwtTokenGenerator _jwtTokenGenerator;

    public AuthService(ILocalBookingDbContext dbContext, IJwtTokenGenerator jwtTokenGenerator)
    {
        _dbContext = dbContext;
        _jwtTokenGenerator = jwtTokenGenerator;
    }

    public async Task<AuthResponseDto> RegisterAsync(RegisterRequestDto request)
    {
        if (await _dbContext.Users.AnyAsync(u => u.Email == request.Email || u.Mobile == request.Mobile))
        {
            return new AuthResponseDto(false, "Email or Mobile number is already registered.", null, null, null);
        }

        string passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

        var user = new User
        {
            UserId = Guid.NewGuid(),
            Name = request.Name,
            Email = request.Email,
            Mobile = request.Mobile,
            PasswordHash = passwordHash,
            UserType = request.UserType,
            Status = UserStatus.ACTIVE,
            CreatedDate = DateTime.UtcNow,
            UpdatedDate = DateTime.UtcNow
        };

        // Assign Role
        int roleId = request.UserType switch
        {
            UserType.ADMIN => 1,
            UserType.OWNER => 2,
            UserType.STAFF => 4,
            _ => 3
        };

        user.UserRoles.Add(new UserRole { UserId = user.UserId, RoleId = roleId });

        await _dbContext.Users.AddAsync(user);
        await _dbContext.SaveChangesAsync();

        string token = _jwtTokenGenerator.GenerateToken(user);
        var userDto = new UserDto(user.UserId.ToString(), user.Name, user.Email, user.Mobile, user.UserType.ToString(), user.Status.ToString());

        return new AuthResponseDto(true, "Registration successful.", token, null, userDto);
    }

    public async Task<AuthResponseDto> LoginAsync(LoginRequestDto request)
    {
        var user = await _dbContext.Users
            .Include(u => u.UserRoles)
            .ThenInclude(ur => ur.Role)
            .FirstOrDefaultAsync(u => u.Email == request.EmailOrMobile || u.Mobile == request.EmailOrMobile);

        if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
        {
            return new AuthResponseDto(false, "Invalid email/mobile or password.", null, null, null);
        }

        if (user.Status != UserStatus.ACTIVE)
        {
            return new AuthResponseDto(false, "Account is suspended or inactive.", null, null, null);
        }

        string token = _jwtTokenGenerator.GenerateToken(user);
        var userDto = new UserDto(user.UserId.ToString(), user.Name, user.Email, user.Mobile, user.UserType.ToString(), user.Status.ToString());

        return new AuthResponseDto(true, "Login successful.", token, null, userDto);
    }
}
