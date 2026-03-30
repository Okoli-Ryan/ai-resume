using Carter;
using Resume_builder.Common;

namespace Resume_builder.Features.Project.GetByResumeId;

public class GetProjectsByResumeIdEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGroup("project")
            .WithTags("Project")
            .RequireAuthorization()
            .MapGet("/resume/{resumeId}", async (
                string resumeId,
                GetProjectsByResumeIdHandler handler,
                CancellationToken cancellationToken) =>
            {
                var response = await handler.Handle(resumeId, cancellationToken);

                return response.GetResult();
            });
    }
}
