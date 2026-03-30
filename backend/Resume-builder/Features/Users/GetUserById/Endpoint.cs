using Carter;
using Resume_builder.Common;

namespace Resume_builder.Features.Users.GetUserById;

public class GetUserByIdEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGroup("user")
            .MapGet("{userId}", async (
                string userId,
                GetUserByIdHandler handler,
                CancellationToken cancellationToken) =>
            {
                var response = await handler.Handle(new GetUserByIdQuery(userId), cancellationToken);

                return response.GetResult();
            });
    }
}
