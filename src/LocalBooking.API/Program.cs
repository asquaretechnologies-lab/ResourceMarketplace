using System.Text;
using LocalBooking.Application.Interfaces;
using LocalBooking.Application.Services;
using LocalBooking.Infrastructure.Data;
using LocalBooking.Infrastructure.Identity;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// Add Services to DI
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "Local Resource Booking Platform API (Kerala)",
        Version = "v1",
        Description = "Generic resource booking backend engine for sports facilities and parking spaces."
    });
});

// Configure Database (PostgreSQL with automatic InMemory fallback for local testing)
var pgConnString = builder.Configuration.GetConnectionString("DefaultConnection") 
    ?? "Host=localhost;Database=LocalBookingDb;Username=postgres;Password=postgres";

bool usePostgres = false;
try
{
    using var testConn = new Npgsql.NpgsqlConnection(pgConnString);
    testConn.Open();
    usePostgres = true;
}
catch
{
    usePostgres = false;
}

if (usePostgres)
{
    builder.Services.AddDbContext<LocalBookingDbContext>(options =>
        options.UseNpgsql(pgConnString));
    Console.WriteLine("[DB INFO] Using PostgreSQL Database Provider.");
}
else
{
    builder.Services.AddDbContext<LocalBookingDbContext>(options =>
        options.UseInMemoryDatabase("LocalBookingDb"));
    Console.WriteLine("[DB INFO] PostgreSQL not active locally. Using InMemory Database for testing.");
}

// Bind ILocalBookingDbContext interface
builder.Services.AddScoped<ILocalBookingDbContext>(provider => 
    provider.GetRequiredService<LocalBookingDbContext>());

// Bind IJwtTokenGenerator
builder.Services.AddScoped<IJwtTokenGenerator, JwtTokenGenerator>();

// Application Services
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IAvailabilityService, AvailabilityService>();
builder.Services.AddScoped<IFacilityService, FacilityService>();
builder.Services.AddScoped<IBookingService, BookingService>();
builder.Services.AddScoped<IRentalService, RentalService>();

// CORS: production origins come from config (Cors:AllowedOrigins, comma-separated or array).
// Development falls back to allow-all for convenience.
var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()
    ?? (builder.Configuration["Cors:AllowedOrigins"] ?? string.Empty)
        .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);

builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
    {
        if (allowedOrigins.Length > 0)
            policy.WithOrigins(allowedOrigins).AllowAnyMethod().AllowAnyHeader();
        else
        {
            if (!builder.Environment.IsDevelopment())
                Console.WriteLine("[CORS WARNING] Cors:AllowedOrigins not set; allowing ALL origins. Set Cors__AllowedOrigins to your Vercel URL.");
            policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
        }
    });
});

// JWT Authentication (must use the SAME settings as JwtTokenGenerator)
var jwtSecret = builder.Configuration["JwtSettings:Secret"] ?? "SuperSecretLocalBookingPlatformKey2026!WithExtraLengthForHS256AlgorithmSafety";
var jwtIssuer = builder.Configuration["JwtSettings:Issuer"] ?? "LocalBookingPlatform";
var jwtAudience = builder.Configuration["JwtSettings:Audience"] ?? "LocalBookingClients";
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidIssuer = jwtIssuer,
        ValidateAudience = true,
        ValidAudience = jwtAudience,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret))
    };
});

var app = builder.Build();

// Configure HTTP Pipeline
// Enable Swagger UI for easy API testing in both Dev and Production
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "LocalBooking API v1");
    c.RoutePrefix = "swagger";
});

app.UseCors("Frontend");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Auto-seed Database on Startup
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<LocalBookingDbContext>();
    try
    {
        await DatabaseSeeder.SeedAsync(context);
        Console.WriteLine("[DB SEED SUCCESS] Database successfully initialized & seeded!");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"[DB SEED ERROR] {ex.Message}");
    }
}

var port = Environment.GetEnvironmentVariable("PORT") ?? "5168";
app.Run($"http://0.0.0.0:{port}");
