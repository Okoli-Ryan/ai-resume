using Carter;
using Resume_builder.Common;
using Resume_builder.Features.Users.GetUserById;
using Resume_builder.Infrastructure.Persistence.Data;

namespace Resume_builder.Features.Users;

public class UserModule() : CarterModule("user")
{
    public override void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("{userId}", async (
            string userId,
            AppDbContext db,
            CancellationToken cancellationToken) =>
        {
            var handler = new GetUserByIdHandler(db);
            var response = await handler.Handle(new GetUserByIdQuery(userId), cancellationToken);

            return response.GetResult();
        });
    }
}