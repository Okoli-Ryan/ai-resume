using Carter;
using Resume_builder.Common;

namespace Resume_builder.Features.BulletPoint.Update;

public class UpdateBulletPointEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGroup("bullet-point")
            .WithTags("Bullet point")
            .RequireAuthorization()
            .MapPut("{bulletPointId}", async (
                string bulletPointId,
                UpdateBulletPointRequest request,
                UpdateBulletPointValidator validator,
                UpdateBulletPointHandler handler,
                CancellationToken cancellationToken) =>
            {
                var validationError = await validator.ValidateRequest(request);
                if (validationError != null)
                    return Results.BadRequest(validationError);

                var response = await handler.Handle(new UpdateBulletPointCommand(bulletPointId, request), cancellationToken);

                return response.GetResult();
            });
    }
}
