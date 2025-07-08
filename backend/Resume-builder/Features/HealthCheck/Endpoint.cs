using Carter;

namespace Resume_builder.Features.HealthCheck;

public class Endpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("health-check", () => Results.Ok());
    }
}