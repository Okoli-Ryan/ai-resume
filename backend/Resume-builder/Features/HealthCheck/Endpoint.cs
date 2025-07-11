using Carter;

namespace Resume_builder.Features.HealthCheck;

public class Endpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapMethods("/health-check", new[] { "GET", "HEAD" }, () => Results.Ok());
    }
}