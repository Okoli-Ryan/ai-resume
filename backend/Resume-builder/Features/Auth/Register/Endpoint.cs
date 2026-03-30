using Carter;
using Resume_builder.Common;

namespace Resume_builder.Features.Auth.Register;

public class RegisterEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        var endpoint = app.MapGroup("auth").WithTags("Auth");

        endpoint.MapPost("register", async (
            RegisterCommand command,
            RegisterValidator validator,
            RegisterHandler handler,
            CancellationToken cancellationToken) =>
        {
            var validationResult = await validator.ValidateRequest(command);
            if (validationResult != null)
                return Results.BadRequest(validationResult);

            var result = await handler.Handle(command, cancellationToken);
            return result.GetResult();
        });
    }
}