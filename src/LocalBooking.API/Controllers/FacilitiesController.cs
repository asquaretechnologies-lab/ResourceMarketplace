using System;
using System.Threading.Tasks;
using LocalBooking.Application.DTOs;
using LocalBooking.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace LocalBooking.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FacilitiesController : ControllerBase
{
    private readonly IFacilityService _facilityService;

    public FacilitiesController(IFacilityService facilityService)
    {
        _facilityService = facilityService;
    }

    [HttpGet("search")]
    public async Task<IActionResult> SearchFacilities([FromQuery] FacilitySearchQueryDto query)
    {
        var result = await _facilityService.SearchFacilitiesAsync(query);
        return Ok(new { success = true, count = result.Count, data = result });
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetFacilityById(Guid id, [FromQuery] DateTime? startDateTime, [FromQuery] DateTime? endDateTime)
    {
        var facility = await _facilityService.GetFacilityByIdAsync(id, startDateTime, endDateTime);
        if (facility == null)
        {
            return NotFound(new { success = false, message = "Facility not found." });
        }
        return Ok(new { success = true, data = facility });
    }
}
