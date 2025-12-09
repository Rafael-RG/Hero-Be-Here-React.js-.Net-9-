using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using HeroBeHere.Core.Entities;
using HeroBeHere.Data;
using System.Net;
using System.Text.Json;

namespace HeroBeHere.Functions;

public class ProviderFunctions
{
    private readonly ILogger _logger;
    private readonly HeroDbContext _context;

    public ProviderFunctions(ILoggerFactory loggerFactory, HeroDbContext context)
    {
        _logger = loggerFactory.CreateLogger<ProviderFunctions>();
        _context = context;
    }

    // Helper method to add CORS headers
    private static void AddCorsHeaders(HttpResponseData response)
    {
        response.Headers.Add("Access-Control-Allow-Origin", "*");
        response.Headers.Add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        response.Headers.Add("Access-Control-Allow-Headers", "Content-Type, Authorization");
    }

    private static JsonSerializerOptions GetJsonOptions()
    {
        return new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            WriteIndented = true
        };
    }

    // Handle OPTIONS requests for CORS
    [Function("OptionsProviders")]
    public HttpResponseData OptionsProviders([HttpTrigger(AuthorizationLevel.Anonymous, "options", Route = "providers")] HttpRequestData req)
    {
        var response = req.CreateResponse(HttpStatusCode.OK);
        AddCorsHeaders(response);
        return response;
    }

    [Function("GetProviders")]
    public async Task<HttpResponseData> GetProviders([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "providers")] HttpRequestData req)
    {
        _logger.LogInformation("Getting all providers");

        try
        {
            var categoryId = req.Query["categoryId"];
            var latitude = req.Query["latitude"];
            var longitude = req.Query["longitude"];
            var radius = req.Query["radius"];

            var query = _context.Providers
                .Include(p => p.Services)
                .Include(p => p.Employees)
                .Include(p => p.Schedules)
                .Where(p => p.IsActive);

            // Filter by category
            if (!string.IsNullOrEmpty(categoryId) && categoryId != "all")
            {
                query = query.Where(p => p.CategoryId == categoryId);
            }

            // Filter by location (basic distance calculation)
            if (!string.IsNullOrEmpty(latitude) && !string.IsNullOrEmpty(longitude))
            {
                if (double.TryParse(latitude, out var lat) && double.TryParse(longitude, out var lng))
                {
                    var radiusKm = double.TryParse(radius, out var r) ? r : 10.0; // Default 10km
                    
                    // Simple distance filter (for production, use proper geospatial functions)
                    query = query.Where(p => 
                        Math.Abs(p.Latitude - lat) <= radiusKm / 111.0 && 
                        Math.Abs(p.Longitude - lng) <= radiusKm / 111.0);
                }
            }

            var providers = await query.OrderByDescending(p => p.Rating).ToListAsync();

            var response = req.CreateResponse(HttpStatusCode.OK);
            await response.WriteAsJsonAsync(providers);
            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting providers");
            var errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
            await errorResponse.WriteStringAsync("Error retrieving providers");
            return errorResponse;
        }
    }

    [Function("GetProvider")]
    public async Task<HttpResponseData> GetProvider([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "providers/{id}")] HttpRequestData req, int id)
    {
        _logger.LogInformation($"Getting provider with ID: {id}");

        try
        {
            var provider = await _context.Providers
                .Include(p => p.Services)
                .Include(p => p.Employees)
                .Include(p => p.Schedules)
                .Include(p => p.Reviews)
                .FirstOrDefaultAsync(p => p.Id == id && p.IsActive);

            if (provider == null)
            {
                var notFoundResponse = req.CreateResponse(HttpStatusCode.NotFound);
                await notFoundResponse.WriteStringAsync("Provider not found");
                return notFoundResponse;
            }

            var response = req.CreateResponse(HttpStatusCode.OK);
            await response.WriteAsJsonAsync(provider);
            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error getting provider {id}");
            var errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
            await errorResponse.WriteStringAsync("Error retrieving provider");
            return errorResponse;
        }
    }

    [Function("CreateProvider")]
    public async Task<HttpResponseData> CreateProvider([HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "providers")] HttpRequestData req)
    {
        _logger.LogInformation("Creating new provider");

        try
        {
            var requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            var jsonOptions = new JsonSerializerOptions 
            {
                PropertyNameCaseInsensitive = true,
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            };
            var providerData = JsonSerializer.Deserialize<Provider>(requestBody, jsonOptions);

            if (providerData == null)
            {
                var badRequestResponse = req.CreateResponse(HttpStatusCode.BadRequest);
                AddCorsHeaders(badRequestResponse);
                await badRequestResponse.WriteStringAsync("Invalid provider data");
                return badRequestResponse;
            }

            // Validate required fields
            if (string.IsNullOrEmpty(providerData.Name) || 
                string.IsNullOrEmpty(providerData.CategoryId) || 
                string.IsNullOrEmpty(providerData.PhoneNumber) ||
                string.IsNullOrEmpty(providerData.Location))
            {
                var validationResponse = req.CreateResponse(HttpStatusCode.BadRequest);
                AddCorsHeaders(validationResponse);
                await validationResponse.WriteStringAsync("Missing required fields");
                return validationResponse;
            }

            // Set defaults
            providerData.CreatedAt = DateTime.UtcNow;
            providerData.UpdatedAt = DateTime.UtcNow;
            providerData.IsActive = true;
            providerData.IsVerified = false;
            providerData.Rating = 0.0;
            providerData.ReviewCount = 0;

            _context.Providers.Add(providerData);
            await _context.SaveChangesAsync();

            var response = req.CreateResponse(HttpStatusCode.Created);
            AddCorsHeaders(response);
            response.Headers.Add("Content-Type", "application/json");
            var json = JsonSerializer.Serialize(providerData, GetJsonOptions());
            await response.WriteStringAsync(json);
            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating provider");
            var errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
            AddCorsHeaders(errorResponse);
            await errorResponse.WriteStringAsync("Error creating provider");
            return errorResponse;
        }
    }

    [Function("UpdateProvider")]
    public async Task<HttpResponseData> UpdateProvider([HttpTrigger(AuthorizationLevel.Anonymous, "put", Route = "providers/{id}")] HttpRequestData req, int id)
    {
        _logger.LogInformation($"Updating provider with ID: {id}");

        try
        {
            var provider = await _context.Providers.FindAsync(id);
            if (provider == null)
            {
                var notFoundResponse = req.CreateResponse(HttpStatusCode.NotFound);
                await notFoundResponse.WriteStringAsync("Provider not found");
                return notFoundResponse;
            }

            var requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            var updatedData = JsonSerializer.Deserialize<Provider>(requestBody, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

            if (updatedData == null)
            {
                var badRequestResponse = req.CreateResponse(HttpStatusCode.BadRequest);
                await badRequestResponse.WriteStringAsync("Invalid provider data");
                return badRequestResponse;
            }

            // Update fields
            provider.Name = updatedData.Name ?? provider.Name;
            provider.CategoryId = updatedData.CategoryId ?? provider.CategoryId;
            provider.Description = updatedData.Description ?? provider.Description;
            provider.PhoneNumber = updatedData.PhoneNumber ?? provider.PhoneNumber;
            provider.Location = updatedData.Location ?? provider.Location;
            provider.Latitude = updatedData.Latitude != 0 ? updatedData.Latitude : provider.Latitude;
            provider.Longitude = updatedData.Longitude != 0 ? updatedData.Longitude : provider.Longitude;
            provider.ImageUrl = updatedData.ImageUrl ?? provider.ImageUrl;
            provider.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            var response = req.CreateResponse(HttpStatusCode.OK);
            await response.WriteAsJsonAsync(provider);
            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error updating provider {id}");
            var errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
            await errorResponse.WriteStringAsync("Error updating provider");
            return errorResponse;
        }
    }

    [Function("DeleteProvider")]
    public async Task<HttpResponseData> DeleteProvider([HttpTrigger(AuthorizationLevel.Anonymous, "delete", Route = "providers/{id}")] HttpRequestData req, int id)
    {
        _logger.LogInformation($"Deleting provider with ID: {id}");

        try
        {
            var provider = await _context.Providers.FindAsync(id);
            if (provider == null)
            {
                var notFoundResponse = req.CreateResponse(HttpStatusCode.NotFound);
                await notFoundResponse.WriteStringAsync("Provider not found");
                return notFoundResponse;
            }

            // Soft delete
            provider.IsActive = false;
            provider.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            var response = req.CreateResponse(HttpStatusCode.NoContent);
            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error deleting provider {id}");
            var errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
            await errorResponse.WriteStringAsync("Error deleting provider");
            return errorResponse;
        }
    }

    [Function("GetCategories")]
    public async Task<HttpResponseData> GetCategories([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "categories")] HttpRequestData req)
    {
        _logger.LogInformation("Getting service categories");

        try
        {
            var categories = await _context.ServiceCategories.ToListAsync();

            var response = req.CreateResponse(HttpStatusCode.OK);
            await response.WriteAsJsonAsync(categories);
            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting categories");
            var errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
            await errorResponse.WriteStringAsync("Error retrieving categories");
            return errorResponse;
        }
    }
}