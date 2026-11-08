using System;
using System.Security.Claims;
using System.Threading.Tasks;
using LocalBooking.Application.DTOs;
using LocalBooking.Application.Interfaces;
using LocalBooking.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LocalBooking.API.Controllers;

[ApiController]
[Route("api/owner/rentals")]
[Authorize]
public class OwnerRentalsController : ControllerBase
{
    private readonly IRentalService _rentalService;

    public OwnerRentalsController(IRentalService rentalService)
    {
        _rentalService = rentalService;
    }

    [HttpGet("vehicle-models")]
    public async Task<IActionResult> GetVehicleModels()
    {
        var models = await _rentalService.GetVehicleModelsAsync();
        return Ok(new { success = true, data = models });
    }

    [HttpGet("vehicles")]
    public async Task<IActionResult> GetVehicles([FromQuery] Guid facilityId)
    {
        var vehicles = await _rentalService.GetOwnerVehiclesAsync(facilityId);
        return Ok(new { success = true, data = vehicles });
    }

    [HttpPost("vehicles")]
    [Authorize(Roles = "OWNER,ADMIN")]
    public async Task<IActionResult> CreateVehicle([FromBody] CreateVehicleRequestDto request)
    {
        try
        {
            var userId = GetUserId();
            var vehicle = await _rentalService.CreateVehicleAsync(userId, request);
            return Ok(new { success = true, message = "Vehicle added to fleet successfully.", data = vehicle });
        }
        catch (Exception ex)
        {
            return BadRequest(new { success = false, message = ex.Message });
        }
    }

    [HttpPatch("vehicles/{id:guid}/status")]
    [Authorize(Roles = "OWNER,STAFF,ADMIN")]
    public async Task<IActionResult> UpdateVehicleStatus(Guid id, [FromBody] UpdateStatusDto dto)
    {
        var userId = GetUserId();
        if (!Enum.TryParse<VehicleStatus>(dto.Status, true, out var status))
            return BadRequest(new { success = false, message = "Invalid vehicle status." });

        bool ok = await _rentalService.UpdateVehicleStatusAsync(userId, id, status);
        if (!ok) return NotFound(new { success = false, message = "Vehicle not found." });
        return Ok(new { success = true, message = $"Vehicle status updated to {status}." });
    }

    [HttpGet("plans")]
    public async Task<IActionResult> GetPlans([FromQuery] Guid facilityId)
    {
        var plans = await _rentalService.GetRentalPlansAsync(facilityId);
        return Ok(new { success = true, data = plans });
    }

    [HttpPost("plans")]
    [Authorize(Roles = "OWNER,ADMIN")]
    public async Task<IActionResult> CreatePlan([FromBody] CreateRentalPlanRequestDto request)
    {
        try
        {
            var userId = GetUserId();
            var plan = await _rentalService.CreateRentalPlanAsync(userId, request);
            return Ok(new { success = true, message = "Pricing plan created successfully.", data = plan });
        }
        catch (Exception ex)
        {
            return BadRequest(new { success = false, message = ex.Message });
        }
    }

    [HttpGet("drivers")]
    public async Task<IActionResult> GetDrivers([FromQuery] Guid facilityId)
    {
        var drivers = await _rentalService.GetDriversAsync(facilityId);
        return Ok(new { success = true, data = drivers });
    }

    [HttpPost("drivers")]
    [Authorize(Roles = "OWNER,ADMIN")]
    public async Task<IActionResult> CreateDriver([FromBody] CreateDriverRequestDto request)
    {
        try
        {
            var userId = GetUserId();
            var driver = await _rentalService.CreateDriverAsync(userId, request);
            return Ok(new { success = true, message = "Driver profile created successfully.", data = driver });
        }
        catch (Exception ex)
        {
            return BadRequest(new { success = false, message = ex.Message });
        }
    }

    [HttpGet("renter-lookup")]
    public async Task<IActionResult> LookupRenter([FromQuery] Guid facilityId, [FromQuery] string phone)
    {
        if (string.IsNullOrWhiteSpace(phone))
            return BadRequest(new { success = false, message = "Phone number is required." });

        var renter = await _rentalService.LookupRenterByPhoneAsync(facilityId, phone);
        return Ok(new { success = true, data = renter });
    }

    [HttpPost("walk-in")]
    [Authorize(Roles = "OWNER,STAFF,ADMIN")]
    public async Task<IActionResult> CreateWalkIn([FromBody] WalkInBookingRequestDto request)
    {
        try
        {
            var staffId = GetUserId();
            var response = await _rentalService.CreateWalkInBookingAsync(staffId, request);
            return Ok(new { success = true, message = "Walk-in booking registered successfully.", data = response });
        }
        catch (Exception ex)
        {
            return BadRequest(new { success = false, message = ex.Message });
        }
    }

    [HttpGet("today-board")]
    public async Task<IActionResult> GetTodayBoard([FromQuery] Guid facilityId, [FromQuery] DateTime? date)
    {
        var board = await _rentalService.GetTodayBoardAsync(facilityId, date);
        return Ok(new { success = true, data = board });
    }

    [HttpPost("bookings/{bookingId:guid}/pickup")]
    [Authorize(Roles = "OWNER,STAFF,ADMIN")]
    public async Task<IActionResult> ProcessPickup(Guid bookingId, [FromBody] PickupHandoverRequestDto request)
    {
        var staffId = GetUserId();
        bool ok = await _rentalService.ProcessPickupAsync(staffId, bookingId, request);
        if (!ok) return BadRequest(new { success = false, message = "Unable to process pickup handover." });
        return Ok(new { success = true, message = "Vehicle handover recorded. Status changed to ON_RENT." });
    }

    [HttpPost("bookings/{bookingId:guid}/return")]
    [Authorize(Roles = "OWNER,STAFF,ADMIN")]
    public async Task<IActionResult> ProcessReturn(Guid bookingId, [FromBody] ReturnInspectionRequestDto request)
    {
        try
        {
            var staffId = GetUserId();
            var estimate = await _rentalService.ProcessReturnInspectionAsync(staffId, bookingId, request);
            return Ok(new { success = true, message = "Return inspection recorded. Final charges calculated.", data = estimate });
        }
        catch (Exception ex)
        {
            return BadRequest(new { success = false, message = ex.Message });
        }
    }

    [HttpPost("bookings/{bookingId:guid}/settle")]
    [Authorize(Roles = "OWNER,STAFF,ADMIN")]
    public async Task<IActionResult> SettleRental(Guid bookingId, [FromBody] SettleRentalRequestDto request)
    {
        var staffId = GetUserId();
        bool ok = await _rentalService.SettleRentalAsync(staffId, bookingId, request);
        if (!ok) return BadRequest(new { success = false, message = "Unable to complete settlement." });
        return Ok(new { success = true, message = "Rental settled and security deposit refunded/closed successfully." });
    }

    [HttpGet("reports/daily")]
    public async Task<IActionResult> GetDailyReport([FromQuery] Guid facilityId, [FromQuery] DateTime? date)
    {
        var targetDate = date ?? DateTime.UtcNow;
        var report = await _rentalService.GetDailyReportAsync(facilityId, targetDate);
        return Ok(new { success = true, data = report });
    }

    private Guid GetUserId()
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? User.FindFirst("sub")?.Value;
        if (Guid.TryParse(claim, out var userId)) return userId;
        throw new UnauthorizedAccessException("Valid user authentication token required.");
    }
}

public record UpdateStatusDto(string Status);
