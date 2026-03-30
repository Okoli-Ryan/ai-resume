using Carter;
using Resume_builder.Common;
using Resume_builder.Features.Resume.Common;

namespace Resume_builder.Features.Resume.PatchUpdateSummary;

public class PatchUpdateSummaryEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        var endpoint = app.MapGroup(ResumeConstants.ResumeMapGroupName)
            .WithTags(ResumeConstants.ResumeMapGroupTag)
            .RequireAuthorization();

        endpoint.MapPatch("{resumeId}/summary", async (
            string resumeId,
            PatchUpdateSummaryRequest request,
            PatchUpdateSummaryValidator validator,
            PatchUpdateSummaryHandler handler,
            CancellationToken cancellationToken) =>
        {
            var validationError = await validator.ValidateRequest(request);
            if (validationError != null)
                return Results.BadRequest(validationError);

            var response = await handler.Handle(new PatchUpdateSummaryCommand(resumeId, request), cancellationToken);
            return response.GetResult();
        });
    }
}