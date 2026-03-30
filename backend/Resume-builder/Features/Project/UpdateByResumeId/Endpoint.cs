using Carter;
using Resume_builder.Common;
using Resume_builder.Features.Project.Update;

namespace Resume_builder.Features.Project.UpdateByResumeId;

public class UpdateProjectsByResumeIdEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGroup("project")
            .WithTags("Project")
            .RequireAuthorization()
            .MapPut("/resume/{resumeId}", async (
                string resumeId,
                List<UpdateProjectRequest> request,
                UpdateProjectsByResumeIdHandler handler,
                CancellationToken cancellationToken) =>
            {
                var response = await handler.Handle(new UpdateProjectsByResumeIdCommand(resumeId, request), cancellationToken);

                return response.GetResult();
            });
    }
}
