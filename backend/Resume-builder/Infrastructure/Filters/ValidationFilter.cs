using System.ComponentModel.DataAnnotations;

namespace Resume_builder.Infrastructure.Filters;

/// <summary>
///     Action filter that performs model validation on minimal API endpoints
///     Returns a comma-separated string of invalid field names
/// </summary>
public class ValidationFilter : IEndpointFilter
{
    public async ValueTask<object?> InvokeAsync(
        EndpointFilterInvocationContext context,
        EndpointFilterDelegate next)
    {
        // Get all arguments from the endpoint
        var validationErrors = new List<string>();

        foreach (var argument in context.Arguments)
        {
            if (argument == null) continue;

            // Create validation context
            var validationContext = new ValidationContext(argument);
            var validationResults = new List<ValidationResult>();

            // Validate the object
            var isValid = Validator.TryValidateObject(
                argument,
                validationContext,
                validationResults,
                true);

            if (!isValid)
                // Extract field names from validation results
                foreach (var validationResult in validationResults)
                    if (validationResult.MemberNames.Any())
                        validationErrors.AddRange(validationResult.MemberNames);
        }

        // If there are validation errors, return them as comma-separated string
        if (validationErrors.Any())
        {
            var errorFields = string.Join(", ", validationErrors.Distinct());

            return Results.BadRequest(new
            {
                errors = errorFields,
                message = $"Validation failed for fields: {errorFields}"
            });
        }

        // If validation passes, continue to the next filter/endpoint
        return await next(context);
    }
}

/// <summary>
///     Extension methods for registering the validation filter
/// </summary>
public static class ValidationFilterExtensions
{
    /// <summary>
    ///     Adds model validation filter to the endpoint
    /// </summary>
    public static RouteHandlerBuilder WithModelValidation(this RouteHandlerBuilder builder)
    {
        return builder.AddEndpointFilter<ValidationFilter>();
    }

    /// <summary>
    ///     Adds model validation filter globally to all endpoints in the route group
    /// </summary>
    public static RouteGroupBuilder WithModelValidation(this RouteGroupBuilder builder)
    {
        return builder.AddEndpointFilter<ValidationFilter>();
    }
}