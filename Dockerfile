# Stage 1: Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy project files for restore optimization
COPY ["src/LocalBooking.API/LocalBooking.API.csproj", "src/LocalBooking.API/"]
COPY ["src/LocalBooking.Application/LocalBooking.Application.csproj", "src/LocalBooking.Application/"]
COPY ["src/LocalBooking.Domain/LocalBooking.Domain.csproj", "src/LocalBooking.Domain/"]
COPY ["src/LocalBooking.Infrastructure/LocalBooking.Infrastructure.csproj", "src/LocalBooking.Infrastructure/"]

RUN dotnet restore "src/LocalBooking.API/LocalBooking.API.csproj"

# Copy source code and build
COPY src/ src/
WORKDIR "/src/src/LocalBooking.API"
RUN dotnet publish "LocalBooking.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Stage 2: Runtime stage (.NET 8 runtime)
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

# Set default port to 8080 (supported by Render & .NET 8)
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "LocalBooking.API.dll"]
