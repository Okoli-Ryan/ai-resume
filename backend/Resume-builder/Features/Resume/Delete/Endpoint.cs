using Carter;
using Resume_builder.Common;
using Resume_builder.Features.Resume.Common;

namespace Resume_builder.Features.Resume.Delete;

public class DeleteResumeEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        var endpoint = app.MapGroup(ResumeConstants.ResumeMapGroupName)
            .WithTags(ResumeConstants.ResumeMapGroupTag)
            .RequireAuthorization();

        endpoint.MapDelete("{resumeId}", async (
            string resumeId,
            DeleteResumeHandler handler,
            CancellationToken cancellationToken) =>
        {
            var response = await handler.Handle(new DeleteResumeCommand(resumeId), cancellationToken);
            return response.GetResult();
        }).WithName("Delete Resume");
    }
}
