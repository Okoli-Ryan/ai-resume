using Carter;
using Resume_builder.Common;
using Resume_builder.Features.Resume.Common;
using Resume_builder.Features.Resume.PatchUpdateResumeInfo;

namespace Resume_builder.Features.Resume.PatchUpdateResumeInfo;

public class PatchUpdateResumeInfoEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        var endpoint = app.MapGroup(ResumeConstants.ResumeMapGroupName)
            .WithTags(ResumeConstants.ResumeMapGroupTag)
            .RequireAuthorization();

        endpoint.MapPatch("{resumeId}/info", async (
            string resumeId,
            PatchUpdateResumeInfoRequest request,
            PatchUpdateResumeInfoValidator validator,
            PatchUpdateResumeInfoHandler handler,
            CancellationToken cancellationToken) =>
        {
            var validationError = await validator.ValidateRequest(request);
            if (validationError != null)
                return Results.BadRequest(validationError);

            var response = await handler.Handle(new PatchUpdateResumeInfoCommand(resumeId, request), cancellationToken);
            return response.GetResult();
        });
    }
}