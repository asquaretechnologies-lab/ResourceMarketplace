using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using LocalBooking.Application.DTOs;
using LocalBooking.Application.Interfaces;
using LocalBooking.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace LocalBooking.Application.Services;

public class FacilityService : IFacilityService
{
    private readonly ILocalBookingDbContext _dbContext;
    private readonly IAvailabilityService _availabilityService;

    public FacilityService(ILocalBookingDbContext dbContext, IAvailabilityService availabilityService)
    {
        _dbContext = dbContext;
        _availabilityService = availabilityService;
    }

    public async Task<List<FacilityDto>> SearchFacilitiesAsync(FacilitySearchQueryDto query)
    {
        var dbQuery = _dbContext.Facilities
            .AsNoTracking()
            .Include(f => f.FacilityType)
            .Include(f => f.Photos)
            .Include(f => f.FacilityFeatures).ThenInclude(ff => ff.Feature)
            .Include(f => f.ParkingAreas).ThenInclude(pa => pa.VehicleType)
            .Include(f => f.Resources).ThenInclude(r => r.SportsType)
            .Include(f => f.Reviews)
            .Where(f => f.Status == FacilityStatusCode.APPROVED);

        if (!string.IsNullOrWhiteSpace(query.FacilityType))
        {
            dbQuery = dbQuery.Where(f => f.FacilityType.Code.ToUpper() == query.FacilityType.ToUpper());
        }

        if (!string.IsNullOrWhiteSpace(query.District))
        {
            dbQuery = dbQuery.Where(f => f.District.ToLower() == query.District.ToLower());
        }

        if (!string.IsNullOrWhiteSpace(query.Keyword))
        {
            string kw = query.Keyword.ToLower();
            dbQuery = dbQuery.Where(f => f.Name.ToLower().Contains(kw) ||
                                         f.Address.ToLower().Contains(kw) ||
                                         f.Landmark.ToLower().Contains(kw) ||
                                         f.Description.ToLower().Contains(kw));
        }

        var facilities = await dbQuery.ToListAsync();
        var resultList = new List<FacilityDto>();

        DateTime start = query.StartDateTime ?? DateTime.UtcNow;
        DateTime end = query.EndDateTime ?? start.AddHours(2);

        foreach (var f in facilities)
        {
            double distKm = 0.0;
            if (query.Latitude.HasValue && query.Longitude.HasValue)
            {
                distKm = CalculateHaversineDistanceKm(query.Latitude.Value, query.Longitude.Value, f.Latitude, f.Longitude);
                if (distKm > query.RadiusKm) continue;
            }

            var parkingDtos = new List<ParkingAreaDto>();
            foreach (var pa in f.ParkingAreas)
            {
                int availableCap = await _availabilityService.GetAvailableParkingCapacityAsync(pa.ParkingAreaId, start, end);
                parkingDtos.Add(new ParkingAreaDto(
                    pa.ParkingAreaId,
                    pa.VehicleTypeId,
                    pa.VehicleType?.Code ?? "",
                    pa.VehicleType?.Name ?? "",
                    pa.TotalCapacity,
                    availableCap,
                    pa.PricePerHour,
                    pa.PricePerDay,
                    pa.PricePerOvernight,
                    pa.PricePerMonth
                ));
            }

            var resourceDtos = new List<ResourceDto>();
            foreach (var r in f.Resources)
            {
                bool isAvail = await _availabilityService.IsSportsResourceAvailableAsync(r.ResourceId, start, end);
                decimal price = 100.0m; // Default or pricing rule lookup
                resourceDtos.Add(new ResourceDto(
                    r.ResourceId,
                    r.Name,
                    r.Description,
                    r.SportsTypeId,
                    r.SportsType?.Name,
                    r.Capacity,
                    r.SlotDurationMinutes,
                    price,
                    isAvail
                ));
            }

            double avgRating = f.Reviews.Any() ? f.Reviews.Average(r => r.Rating) : 4.5;
            int reviewCount = f.Reviews.Count;

            resultList.Add(new FacilityDto(
                f.FacilityId,
                f.Name,
                f.Description,
                f.Address,
                f.District,
                f.State,
                f.PostalCode,
                f.Latitude,
                f.Longitude,
                f.Landmark,
                Math.Round(distKm, 2),
                f.Is24Hours,
                f.OpeningTime.ToString(@"hh\:mm"),
                f.ClosingTime.ToString(@"hh\:mm"),
                f.FacilityType.Code,
                f.Status.ToString(),
                Math.Round(avgRating, 1),
                reviewCount,
                f.Photos.OrderByDescending(p => p.IsPrimary).Select(p => p.ImageUrl).ToList(),
                f.FacilityFeatures.Select(ff => ff.Feature.Name).ToList(),
                parkingDtos,
                resourceDtos
            ));
        }

        return resultList.OrderBy(x => x.DistanceKm).ToList();
    }

    public async Task<FacilityDto?> GetFacilityByIdAsync(Guid facilityId, DateTime? startDateTime = null, DateTime? endDateTime = null)
    {
        var query = new FacilitySearchQueryDto(
            Keyword: null,
            FacilityType: null,
            SportsType: null,
            VehicleType: null,
            Latitude: null,
            Longitude: null,
            RadiusKm: 10000,
            District: null,
            StartDateTime: startDateTime,
            EndDateTime: endDateTime
        );

        var list = await SearchFacilitiesAsync(query);
        return list.FirstOrDefault(f => f.FacilityId == facilityId);
    }

    private static double CalculateHaversineDistanceKm(double lat1, double lon1, double lat2, double lon2)
    {
        var R = 6371; // Earth radius in km
        var dLat = ToRadians(lat2 - lat1);
        var dLon = ToRadians(lon2 - lon1);
        var a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                Math.Cos(ToRadians(lat1)) * Math.Cos(ToRadians(lat2)) *
                Math.Sin(dLon / 2) * Math.Sin(dLon / 2);
        var c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
        return R * c;
    }

    private static double ToRadians(double val) => (Math.PI / 180) * val;
}
