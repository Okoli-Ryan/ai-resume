using Carter;
using Resume_builder.Common;

namespace Resume_builder.Features.Link.Create;

public class CreateLinkEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGroup("link")
            .WithTags("Link")
            .MapPost("", async (
                CreateLinkCommand command,
                CreateLinkValidator validator,
                CreateLinkHandler handler,
                CancellationToken cancellationToken) =>
            {
                var validationError = await validator.ValidateRequest(command);
                if (validationError != null)
                    return Results.BadRequest(validationError);

                var response = await handler.Handle(command, cancellationToken);

                return response.GetResult();
            });
    }
}
