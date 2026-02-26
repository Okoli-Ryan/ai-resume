using Carter;
using Resume_builder.Infrastructure.Filters;

namespace Resume_builder.Utils;

public static class CarterValidationExtensions
{
    /// <summary>
    ///     Maps all Carter modules with global validation
    ///     Usage: app.MapCarterWithValidation();
    /// </summary>
    public static WebApplication MapCarterWithValidation(this WebApplication app)
    {
        var modules = app.Services.GetServices<ICarterModule>();

        // Create a validated root group
        var validatedGroup = app.MapGroup("")
            .AddEndpointFilter<ValidationFilter>();

        // Register all Carter modules through the validated group
        foreach (var module in modules) module.AddRoutes(validatedGroup);

        return app;
    }

    /// <summary>
    ///     Maps all Carter modules with validation under a specific prefix
    ///     Usage: app.MapCarterWithValidation("/api/v1");
    /// </summary>
    public static WebApplication MapCarterWithValidation(this WebApplication app, string prefix)
    {
        var modules = app.Services.GetServices<ICarterModule>();

        // Create a validated group with prefix
        var validatedGroup = app.MapGroup(prefix)
            .AddEndpointFilter<ValidationFilter>();

        // Register all Carter modules through the validated group
        foreach (var module in modules) module.AddRoutes(validatedGroup);

        return app;
    }
}