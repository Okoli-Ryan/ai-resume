using Carter;
using Resume_builder.Common;
using Resume_builder.Features.Resume.Common;

namespace Resume_builder.Features.Resume.PatchUpdateLinks;

public class PatchUpdateLinksEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        var endpoint = app.MapGroup(ResumeConstants.ResumeMapGroupName)
            .WithTags(ResumeConstants.ResumeMapGroupTag)
            .RequireAuthorization();

        endpoint.MapPatch("{resumeId}/links", async (
            string resumeId,
            PatchUpdateLinksRequest request,
            PatchUpdateLinksValidator validator,
            PatchUpdateLinksHandler handler,
            CancellationToken cancellationToken) =>
        {
            var validationError = await validator.ValidateRequest(request);
            if (validationError != null)
                return Results.BadRequest(validationError);

            var response = await handler.Handle(new PatchUpdateLinksCommand(resumeId, request), cancellationToken);
            return response.GetResult();
        });
    }
}