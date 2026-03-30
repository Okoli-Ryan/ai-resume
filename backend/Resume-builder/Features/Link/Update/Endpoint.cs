using Carter;
using Resume_builder.Common;

namespace Resume_builder.Features.Link.Update;

public class UpdateLinkEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGroup("link")
            .WithTags("Link")
            .MapPut("{id}", async (
                string id,
                UpdateLinkRequest request,
                UpdateLinkValidator validator,
                UpdateLinkHandler handler,
                CancellationToken cancellationToken) =>
            {
                var validationError = await validator.ValidateRequest(request);
                if (validationError != null)
                    return Results.BadRequest(validationError);

                var response = await handler.Handle(new UpdateLinkCommand(id, request), cancellationToken);

                return response.GetResult();
            });
    }
}
