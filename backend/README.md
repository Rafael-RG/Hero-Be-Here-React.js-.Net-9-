# Hero Be Here - Backend Architecture

Este backend está diseñado utilizando **Clean Architecture** con **Azure Functions** en .NET 9.

## Estructura de la Solución

1.  **HeroBeHere.Core**: La capa interna. Contiene las Entidades (Entities), Interfaces y DTOs. No tiene dependencias externas.
2.  **HeroBeHere.Data**: La capa de infraestructura de datos. Implementa `DbContext` de Entity Framework Core.
3.  **HeroBeHere.Services**: La capa de lógica de negocio.
4.  **HeroBeHere.Functions**: La capa de presentación (API). Azure Functions v4 (Isolated Worker).

## Tecnologías

*   **.NET 9**
*   **Azure Functions** (Isolated Process)
*   **Entity Framework Core** (SQL Server)
*   **Azure Blob Storage** (Para imágenes)
*   **Azure SQL Database Serverless** (Recomendado para datos relacionales)

## Configuración (local.settings.json)

```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "UseDevelopmentStorage=true",
    "FUNCTIONS_WORKER_RUNTIME": "dotnet-isolated",
    "SqlConnectionString": "Server=tcp:hero-server.database.windows.net...;",
    "BlobStorageConnection": "DefaultEndpointsProtocol=https;..."
  }
}
```
