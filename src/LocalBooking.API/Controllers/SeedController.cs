using System;
using System.Threading.Tasks;
using LocalBooking.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LocalBooking.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SeedController : ControllerBase
{
    private readonly LocalBookingDbContext _dbContext;
    private readonly IWebHostEnvironment _env;

    public SeedController(LocalBookingDbContext dbContext, IWebHostEnvironment env)
    {
        _dbContext = dbContext;
        _env = env;
    }

    /// <summary>Re-seeds demo data. Allowed for ADMIN users, or anyone in Development.</summary>
    [HttpPost("init")]
    [AllowAnonymous]
    public async Task<IActionResult> SeedDatabase()
    {
        if (!_env.IsDevelopment() && !User.IsInRole("ADMIN"))
            return Forbid();
        try
        {
            await DatabaseSeeder.SeedAsync(_dbContext);
            return Ok(new { success = true, message = "Database initialized and seeded successfully with Kerala parking & sports test data." });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { success = false, message = ex.Message, detail = ex.InnerException?.Message });
        }
    }
}
