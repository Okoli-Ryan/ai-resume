using Carter;
using Resume_builder.Common;

namespace Resume_builder.Features.BulletPoint.Enhance;

public class EnhanceBulletPointEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGroup("bullet-point")
            .WithTags("Bullet point")
            .RequireAuthorization()
            .MapPost("/enhance/{bulletPointId}", async (
                string bulletPointId,
                EnhanceBulletPointAdditionalInfo request,
                EnhanceBulletPointHandler handler,
                CancellationToken cancellationToken) =>
            {
                var response = await handler.Handle(new EnhanceBulletPointCommand(bulletPointId, request), cancellationToken);

                return response.GetResult();
            });
    }
}
