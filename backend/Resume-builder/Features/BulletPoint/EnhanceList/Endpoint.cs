using Carter;
using Resume_builder.Common;

namespace Resume_builder.Features.BulletPoint.EnhanceList;

public class EnhanceBulletPointsEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGroup("bullet-point")
            .WithTags("Bullet point")
            .RequireAuthorization()
            .MapPost("/enhance-list/{enhanceType}", async (
                EnhanceTypes enhanceType,
                EnhanceExperienceBulletPointsRequest command,
                EnhanceBulletPointsHandler handler,
                CancellationToken cancellationToken) =>
            {
                var response = await handler.Handle(new EnhanceExperienceBulletPointsCommand(enhanceType, command), cancellationToken);

                return response.GetResult();
            });
    }
}
