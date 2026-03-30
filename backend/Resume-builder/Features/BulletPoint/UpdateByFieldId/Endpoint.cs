using Carter;
using Resume_builder.Common;

namespace Resume_builder.Features.BulletPoint.UpdateByFieldId;

public class UpdateBulletPointsByFieldIdEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGroup("bullet-point")
            .WithTags("Bullet point")
            .RequireAuthorization()
            .MapPut("{fieldType}/{fieldId}", async (
                FieldType fieldType,
                string fieldId,
                UpdateBulletPointsByFieldIdRequest request,
                UpdateBulletPointsByFieldIdValidator validator,
                UpdateBulletPointsByFieldIdHandler handler,
                CancellationToken cancellationToken) =>
            {
                var validationError = await validator.ValidateRequest(request);
                if (validationError != null)
                    return Results.BadRequest(validationError);

                var response = await handler.Handle(new UpdateBulletPointsByFieldIdCommand(fieldType, fieldId, request.BulletPoints), cancellationToken);

                return response.GetResult();
            });
    }
}
