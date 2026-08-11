using LocalBooking.Domain.Entities;

namespace LocalBooking.Application.Interfaces;

public interface IJwtTokenGenerator
{
    string GenerateToken(User user);
}
