using Carter;
using Microsoft.AspNetCore.Mvc;
using Resume_builder.Common;

namespace Resume_builder.Features.Auth.Login;

public class LoginEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        var endpoint = app.MapGroup("auth").WithTags("Auth");

        endpoint.MapPost("login", async (
            [FromBody] LoginCommand command,
            LoginValidator validator,
            LoginHandler handler,
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