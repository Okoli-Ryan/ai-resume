using Carter;
using Resume_builder.Common;

namespace Resume_builder.Features.Link.GetLinksByUser;

public class GetLinksByUserEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGroup("link")
            .WithTags("Link")
            .MapGet("user/{userId}", async (
                string userId,
                GetLinksByUserHandler handler,
                CancellationToken cancellationToken) =>
            {
                var response = await handler.Handle(new GetLinksByUserQuery(userId), cancellationToken);

                return response.GetResult();
            });
    }
}
