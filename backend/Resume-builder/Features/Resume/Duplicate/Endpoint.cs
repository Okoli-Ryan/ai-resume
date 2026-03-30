using Carter;
using Resume_builder.Common;
using Resume_builder.Features.Resume.Common;

namespace Resume_builder.Features.Resume.Duplicate;

public class DuplicateResumeEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        var endpoint = app.MapGroup(ResumeConstants.ResumeMapGroupName)
            .WithTags(ResumeConstants.ResumeMapGroupTag)
            .RequireAuthorization();

        endpoint.MapPost("duplicate/{resumeId}", async (
            string resumeId,
            DuplicateResumeHandler handler,
            CancellationToken cancellationToken) =>
        {
            var response = await handler.Handle(new DuplicateResumeCommand(resumeId), cancellationToken);
            return response.GetResult();
        });
    }
}