using Carter;
using Resume_builder.Common;
using Resume_builder.Features.BulletPoint.Enhance_List;
using Resume_builder.Features.BulletPoint.Enhance;
using Resume_builder.Infrastructure.Persistence.Data;
using Resume_builder.Infrastructure.Services.AIChatClient;
using Resume_builder.Infrastructure.Services.ClaimService;

namespace Resume_builder.Features.BulletPoint;

public class BulletPointEndpoints : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        var endpoint = app.MapGroup("bullet-point").WithTags("Bullet point").RequireAuthorization();

        endpoint.MapPost("/enhance/{bulletPointId}", async (
            string bulletPointId,
            EnhanceBulletPointAdditionalInfo request,
            IAIChatClient chatClient,
            IClaimsService claimsService,
            AppDbContext db,
            CancellationToken cancellationToken
        ) =>
        {
            var handler = new EnhanceBulletPointHandler(chatClient, db, claimsService);
            var response =
                await handler.Handle(new EnhanceBulletPointCommand(bulletPointId, request), cancellationToken);

            return response.GetResult();
        });


        endpoint.MapPost("/enhance-list/{enhanceType}", async (
            EnhanceTypes enhanceType,
            EnhanceExperienceBulletPointsRequest command,
            IAIChatClient chatClient,
            IClaimsService claimsService,
            CancellationToken cancellationToken
        ) =>
        {
            var handler = new EnhanceBulletPointsHandler(chatClient, claimsService);
            var response =
                await handler.Handle(new EnhanceExperienceBulletPointsCommand(enhanceType, command), cancellationToken);

            return response.GetResult();
        });
    }
}