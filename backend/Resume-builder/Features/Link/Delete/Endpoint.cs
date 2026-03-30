using Carter;
using Resume_builder.Common;

namespace Resume_builder.Features.Link.Delete;

public class DeleteLinkEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGroup("link")
            .WithTags("Link")
            .MapDelete("{id}", async (
                string id,
                DeleteLinkHandler handler,
                CancellationToken cancellationToken) =>
            {
                var response = await handler.Handle(new DeleteLinkCommand(id), cancellationToken);

                return response.GetResult();
            });
    }
}
