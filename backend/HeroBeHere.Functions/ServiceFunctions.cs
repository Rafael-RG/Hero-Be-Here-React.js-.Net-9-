using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using HeroBeHere.Core.Entities;
using HeroBeHere.Data;
using System.Net;
using System.Text.Json;

namespace HeroBeHere.Functions;

public class ServiceFunctions
{
    private readonly ILogger _logger;
    private readonly HeroDbContext _context;

    public ServiceFunctions(ILoggerFactory loggerFactory, HeroDbContext context)
    {
        _logger = loggerFactory.CreateLogger<ServiceFunctions>();
        _context = context;
    }

    // Helper method to add CORS headers
    private static void AddCorsHeaders(HttpResponseData response)
    {
        response.Headers.Add("Access-Control-Allow-Origin", "http://localhost:3000");
        response.Headers.Add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        response.Headers.Add("Access-Control-Allow-Headers", "Content-Type, Authorization");
    }

    // Handle OPTIONS requests for CORS
    [Function("OptionsProviderServices")]
    public HttpResponseData OptionsProviderServices([HttpTrigger(AuthorizationLevel.Anonymous, "options", Route = "providers/{providerId}/services")] HttpRequestData req)
    {
        var response = req.CreateResponse(HttpStatusCode.OK);
        AddCorsHeaders(response);
        return response;
    }

    [Function("GetProviderServices")]
    public async Task<HttpResponseData> GetProviderServices(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "providers/{providerId}/services")] HttpRequestData req, 
        int providerId)
    {
        _logger.LogInformation($"Getting services for provider {providerId}");

        try
        {
            var services = await _context.Services
                .Where(s => s.ProviderId == providerId && s.IsActive)
                .OrderBy(s => s.Name)
                .ToListAsync();

            var response = req.CreateResponse(HttpStatusCode.OK);
            await response.WriteAsJsonAsync(services);
            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error getting services for provider {providerId}");
            var errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
            await errorResponse.WriteStringAsync("Error retrieving services");
            return errorResponse;
        }
    }

    [Function("CreateProviderService")]
    public async Task<HttpResponseData> CreateProviderService(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "providers/{providerId}/services")] HttpRequestData req, 
        int providerId)
    {
        _logger.LogInformation($"Creating service for provider {providerId}");
        _logger.LogInformation($"Raw route values: {string.Join(", ", req.FunctionContext.BindingContext.BindingData.Select(x => $"{x.Key}={x.Value}"))}");

        try
        {
            // Check if provider exists
            var providerExists = await _context.Providers.AnyAsync(p => p.Id == providerId && p.IsActive);
            if (!providerExists)
            {
                var notFoundResponse = req.CreateResponse(HttpStatusCode.NotFound);
                AddCorsHeaders(notFoundResponse);
                await notFoundResponse.WriteStringAsync("Provider not found");
                return notFoundResponse;
            }

            var requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            var jsonOptions = new JsonSerializerOptions 
            {
                PropertyNameCaseInsensitive = true,
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            };
            var serviceData = JsonSerializer.Deserialize<ServiceItem>(requestBody, jsonOptions);

            if (serviceData == null)
            {
                var badRequestResponse = req.CreateResponse(HttpStatusCode.BadRequest);
                AddCorsHeaders(badRequestResponse);
                await badRequestResponse.WriteStringAsync("Invalid service data");
                return badRequestResponse;
            }

            // Validate required fields
            if (string.IsNullOrEmpty(serviceData.Name) || serviceData.Price <= 0)
            {
                var validationResponse = req.CreateResponse(HttpStatusCode.BadRequest);
                AddCorsHeaders(validationResponse);
                await validationResponse.WriteStringAsync("Name and Price are required");
                return validationResponse;
            }

            // Set provider ID and defaults
            serviceData.ProviderId = providerId;
            serviceData.CreatedAt = DateTime.UtcNow;
            serviceData.IsActive = true;

            _context.Services.Add(serviceData);
            await _context.SaveChangesAsync();

            var response = req.CreateResponse(HttpStatusCode.Created);
            AddCorsHeaders(response);
            await response.WriteAsJsonAsync(serviceData);
            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error creating service for provider {providerId}");
            var errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
            AddCorsHeaders(errorResponse);
            await errorResponse.WriteStringAsync("Error creating service");
            return errorResponse;
        }
    }

    [Function("UpdateProviderService")]
    public async Task<HttpResponseData> UpdateProviderService(
        [HttpTrigger(AuthorizationLevel.Anonymous, "put", Route = "providers/{providerId}/services/{serviceId}")] HttpRequestData req, 
        int providerId, int serviceId)
    {
        _logger.LogInformation($"Updating service {serviceId} for provider {providerId}");

        try
        {
            var service = await _context.Services
                .FirstOrDefaultAsync(s => s.Id == serviceId && s.ProviderId == providerId && s.IsActive);

            if (service == null)
            {
                var notFoundResponse = req.CreateResponse(HttpStatusCode.NotFound);
                await notFoundResponse.WriteStringAsync("Service not found");
                return notFoundResponse;
            }

            var requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            var updatedData = JsonSerializer.Deserialize<ServiceItem>(requestBody, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

            if (updatedData == null)
            {
                var badRequestResponse = req.CreateResponse(HttpStatusCode.BadRequest);
                await badRequestResponse.WriteStringAsync("Invalid service data");
                return badRequestResponse;
            }

            // Update fields
            service.Name = updatedData.Name ?? service.Name;
            service.Description = updatedData.Description ?? service.Description;
            service.Price = updatedData.Price > 0 ? updatedData.Price : service.Price;
            service.Duration = updatedData.Duration > 0 ? updatedData.Duration : service.Duration;
            service.CategoryId = updatedData.CategoryId ?? service.CategoryId;
            service.SubcategoryId = updatedData.SubcategoryId ?? service.SubcategoryId;

            await _context.SaveChangesAsync();

            var response = req.CreateResponse(HttpStatusCode.OK);
            await response.WriteAsJsonAsync(service);
            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error updating service {serviceId} for provider {providerId}");
            var errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
            await errorResponse.WriteStringAsync("Error updating service");
            return errorResponse;
        }
    }

    [Function("DeleteProviderService")]
    public async Task<HttpResponseData> DeleteProviderService(
        [HttpTrigger(AuthorizationLevel.Anonymous, "delete", Route = "providers/{providerId}/services/{serviceId}")] HttpRequestData req, 
        int providerId, int serviceId)
    {
        _logger.LogInformation($"Deleting service {serviceId} for provider {providerId}");

        try
        {
            var service = await _context.Services
                .FirstOrDefaultAsync(s => s.Id == serviceId && s.ProviderId == providerId && s.IsActive);

            if (service == null)
            {
                var notFoundResponse = req.CreateResponse(HttpStatusCode.NotFound);
                await notFoundResponse.WriteStringAsync("Service not found");
                return notFoundResponse;
            }

            // Soft delete
            service.IsActive = false;
            await _context.SaveChangesAsync();

            var response = req.CreateResponse(HttpStatusCode.NoContent);
            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error deleting service {serviceId} for provider {providerId}");
            var errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
            await errorResponse.WriteStringAsync("Error deleting service");
            return errorResponse;
        }
    }

    [Function("GetServicesByCategory")]
    public async Task<HttpResponseData> GetServicesByCategory(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "services/category/{categoryId}")] HttpRequestData req, 
        string categoryId)
    {
        _logger.LogInformation($"Getting services for category {categoryId}");

        try
        {
            var query = _context.Services
                .Include(s => s.Provider)
                .Where(s => s.IsActive && s.Provider.IsActive);

            if (categoryId != "all")
            {
                query = query.Where(s => s.CategoryId == categoryId);
            }

            var subcategory = req.Query["subcategory"];
            if (!string.IsNullOrEmpty(subcategory))
            {
                query = query.Where(s => s.SubcategoryId == subcategory);
            }

            var services = await query
                .OrderBy(s => s.Provider.Rating)
                .ThenBy(s => s.Price)
                .ToListAsync();

            var response = req.CreateResponse(HttpStatusCode.OK);
            await response.WriteAsJsonAsync(services);
            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error getting services for category {categoryId}");
            var errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
            await errorResponse.WriteStringAsync("Error retrieving services");
            return errorResponse;
        }
    }
}