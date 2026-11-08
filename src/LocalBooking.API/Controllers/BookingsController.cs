using System;
using System.Security.Claims;
using System.Threading.Tasks;
using LocalBooking.Application.DTOs;
using LocalBooking.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LocalBooking.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class BookingsController : ControllerBase
{
    private readonly IBookingService _bookingService;

    public BookingsController(IBookingService bookingService)
    {
        _bookingService = bookingService;
    }

    [HttpPost]
    public async Task<IActionResult> CreateBooking([FromBody] CreateBookingRequestDto request)
    {
        try
        {
            Guid userId = GetUserIdFromClaims();
            var response = await _bookingService.CreateBookingAsync(userId, request);
            return Ok(new { success = true, message = "Booking created successfully.", data = response });
        }
        catch (Exception ex)
        {
            return BadRequest(new { success = false, message = ex.Message });
        }
    }

    [HttpGet("my-bookings")]
    public async Task<IActionResult> GetMyBookings()
    {
        Guid userId = GetUserIdFromClaims();
        var bookings = await _bookingService.GetUserBookingsAsync(userId);
        return Ok(new { success = true, data = bookings });
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetBookingById(Guid id)
    {
        var booking = await _bookingService.GetBookingByIdAsync(id);
        if (booking == null) return NotFound(new { success = false, message = "Booking not found." });
        return Ok(new { success = true, data = booking });
    }

    [HttpPost("check-in")]
    [Authorize(Roles = "OWNER,STAFF,ADMIN")]
    public async Task<IActionResult> CheckInOrOut([FromBody] CheckInRequestDto request)
    {
        Guid staffUserId = GetUserIdFromClaims();
        var response = await _bookingService.ProcessCheckInOrOutAsync(staffUserId, request);
        if (!response.Success)
        {
            return BadRequest(new { success = false, message = response.Message, data = response });
        }
        return Ok(new { success = true, message = response.Message, data = response });
    }

    [HttpPost("{id:guid}/cancel")]
    public async Task<IActionResult> CancelBooking(Guid id)
    {
        Guid userId = GetUserIdFromClaims();
        bool success = await _bookingService.CancelBookingAsync(userId, id);
        if (!success) return BadRequest(new { success = false, message = "Booking cannot be cancelled." });
        return Ok(new { success = true, message = "Booking cancelled successfully." });
    }

    private Guid GetUserIdFromClaims()
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? User.FindFirst("sub")?.Value;
        if (Guid.TryParse(claim, out var userId))
        {
            return userId;
        }
        throw new UnauthorizedAccessException("Invalid user token.");
    }
}
