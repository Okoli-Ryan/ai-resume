using Carter;
using Resume_builder.Common;
using Resume_builder.Features.Resume.Common;

namespace Resume_builder.Features.Resume.GetResumeInfo;

public class GetResumeInfoEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        var endpoint = app.MapGroup(ResumeConstants.ResumeMapGroupName)
            .WithTags(ResumeConstants.ResumeMapGroupTag)
            .RequireAuthorization();

        endpoint.MapGet("{resumeId}/info", async (
            string resumeId,
            GetResumeInfoHandler handler,
            CancellationToken cancellationToken) =>
        {
            var response = await handler.Handle(resumeId, cancellationToken);
            return response.GetResult();
        });
    }
}