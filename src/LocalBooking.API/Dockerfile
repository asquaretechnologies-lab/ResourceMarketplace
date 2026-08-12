# Stage 1: Build stage
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy project files
COPY ["LocalBooking.API.csproj", "LocalBooking.API/"]
COPY ["../LocalBooking.Application/LocalBooking.Application.csproj", "LocalBooking.Application/"]
COPY ["../LocalBooking.Domain/LocalBooking.Domain.csproj", "LocalBooking.Domain/"]
COPY ["../LocalBooking.Infrastructure/LocalBooking.Infrastructure.csproj", "LocalBooking.Infrastructure/"]

RUN dotnet restore "LocalBooking.API/LocalBooking.API.csproj"

# Copy source code and build
COPY .. .
WORKDIR "/src/LocalBooking.API"
RUN dotnet publish "LocalBooking.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Stage 2: Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "LocalBooking.API.dll"]
