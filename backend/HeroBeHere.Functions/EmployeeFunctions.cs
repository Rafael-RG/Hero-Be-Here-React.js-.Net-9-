using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using HeroBeHere.Core.Entities;
using HeroBeHere.Data;
using System.Net;
using System.Text.Json;

namespace HeroBeHere.Functions;

public class EmployeeFunctions
{
    private readonly ILogger _logger;
    private readonly HeroDbContext _context;

    public EmployeeFunctions(ILoggerFactory loggerFactory, HeroDbContext context)
    {
        _logger = loggerFactory.CreateLogger<EmployeeFunctions>();
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
    [Function("OptionsProviderEmployees")]
    public HttpResponseData OptionsProviderEmployees([HttpTrigger(AuthorizationLevel.Anonymous, "options", Route = "providers/{providerId}/employees")] HttpRequestData req)
    {
        var response = req.CreateResponse(HttpStatusCode.OK);
        AddCorsHeaders(response);
        return response;
    }

    [Function("CreateProviderEmployee")]
    public async Task<HttpResponseData> CreateProviderEmployee(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "providers/{providerId}/employees")] HttpRequestData req, 
        int providerId)
    {
        _logger.LogInformation($"Creating employee for provider {providerId}");
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
            var employeeData = JsonSerializer.Deserialize<Employee>(requestBody, jsonOptions);

            if (employeeData == null)
            {
                var badRequestResponse = req.CreateResponse(HttpStatusCode.BadRequest);
                AddCorsHeaders(badRequestResponse);
                await badRequestResponse.WriteStringAsync("Invalid employee data");
                return badRequestResponse;
            }

            // Validate required fields
            if (string.IsNullOrEmpty(employeeData.Name))
            {
                var validationResponse = req.CreateResponse(HttpStatusCode.BadRequest);
                AddCorsHeaders(validationResponse);
                await validationResponse.WriteStringAsync("Name is required");
                return validationResponse;
            }

            // Set provider ID and defaults
            employeeData.ProviderId = providerId;
            employeeData.CreatedAt = DateTime.UtcNow;
            employeeData.IsActive = true;

            _context.Employees.Add(employeeData);
            await _context.SaveChangesAsync();

            var response = req.CreateResponse(HttpStatusCode.Created);
            AddCorsHeaders(response);
            await response.WriteAsJsonAsync(employeeData);
            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error creating employee for provider {providerId}");
            var errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
            AddCorsHeaders(errorResponse);
            await errorResponse.WriteStringAsync("Error creating employee");
            return errorResponse;
        }
    }

    [Function("GetProviderEmployees")]
    public async Task<HttpResponseData> GetProviderEmployees(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "providers/{providerId}/employees")] HttpRequestData req, 
        int providerId)
    {
        _logger.LogInformation($"Getting employees for provider {providerId}");

        try
        {
            var employees = await _context.Employees
                .Where(e => e.ProviderId == providerId && e.IsActive)
                .ToListAsync();

            var response = req.CreateResponse(HttpStatusCode.OK);
            AddCorsHeaders(response);
            await response.WriteAsJsonAsync(employees);
            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error getting employees for provider {providerId}");
            var errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
            AddCorsHeaders(errorResponse);
            await errorResponse.WriteStringAsync("Error retrieving employees");
            return errorResponse;
        }
    }
}