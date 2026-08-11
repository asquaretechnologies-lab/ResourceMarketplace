using System;
using System.Threading.Tasks;
using LocalBooking.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;

namespace LocalBooking.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SeedController : ControllerBase
{
    private readonly LocalBookingDbContext _dbContext;

    public SeedController(LocalBookingDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpPost("init")]
    public async Task<IActionResult> SeedDatabase()
    {
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
