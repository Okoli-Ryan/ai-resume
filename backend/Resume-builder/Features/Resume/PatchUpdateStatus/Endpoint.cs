using Carter;
using Resume_builder.Features.Resume.Common;

namespace Resume_builder.Features.Resume.PatchUpdateStatus;

public class PatchUpdateResumeStatusEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        var endpoint = app.MapGroup(ResumeConstants.ResumeMapGroupName)
            .WithTags(ResumeConstants.ResumeMapGroupTag)
            .RequireAuthorization();

        endpoint.MapPatch("{resumeId}/status", async (
            string resumeId,
            PatchUpdateResumeStatusRequest request,
            PatchUpdateResumeStatusHandler handler,
            CancellationToken cancellationToken) =>
        {
            var response = await handler.Handle(new PatchUpdateResumeStatusCommand(resumeId, request.Status), cancellationToken);
            return response.GetResult();
        });
    }
}

public record PatchUpdateResumeStatusRequest(string Status);
