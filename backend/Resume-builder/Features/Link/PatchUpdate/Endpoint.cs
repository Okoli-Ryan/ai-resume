using Carter;
using Resume_builder.Common;

namespace Resume_builder.Features.Link.PatchUpdate;

public class PatchUpdateLinkEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGroup("link")
            .WithTags("Link")
            .MapPatch("{id}", async (
                string id,
                PatchUpdateLinkRequest request,
                PatchUpdateLinkValidator validator,
                PatchUpdateLinkHandler handler,
                CancellationToken cancellationToken) =>
            {
                var validationError = await validator.ValidateRequest(request);
                if (validationError != null)
                    return Results.BadRequest(validationError);

                var response = await handler.Handle(new PatchUpdateLinkCommand(id, request), cancellationToken);

                return response.GetResult();
            })
            .WithName("Patch Update Link");
    }
}
