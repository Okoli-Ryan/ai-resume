using Carter;
using Resume_builder.Common;
using Resume_builder.Features.Auth.GoogleLogin;

namespace Resume_builder.Features.Auth.GoogleSignin;

public class GoogleSigninEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        var endpoint = app.MapGroup("auth").WithTags("Auth");

        endpoint.MapPost("google", async (
            GoogleSigninCommand command,
            GoogleSigninValidator validator,
            GoogleSigninHandler handler,
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