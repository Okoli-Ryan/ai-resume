using Carter;
using Resume_builder.Common;
using Resume_builder.Features.Resume.Common;
using Resume_builder.Features.Resume.PatchUpdateOrder;

namespace Resume_builder.Features.Resume.PatchUpdateOrder;

public class PatchUpdateOrderEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        var endpoint = app.MapGroup(ResumeConstants.ResumeMapGroupName)
            .WithTags(ResumeConstants.ResumeMapGroupTag)
            .RequireAuthorization();

        endpoint.MapPatch("{resumeId}/order", async (
            string resumeId,
            PatchUpdateOrderRequest request,
            PatchUpdateOrderValidator validator,
            PatchUpdateOrderHandler handler,
            CancellationToken cancellationToken) =>
        {
            var validationError = await validator.ValidateRequest(request);
            if (validationError != null)
                return Results.BadRequest(validationError);

            var response = await handler.Handle(new PatchUpdateOrderCommand(resumeId, request), cancellationToken);
            return response.GetResult();
        });
    }
}