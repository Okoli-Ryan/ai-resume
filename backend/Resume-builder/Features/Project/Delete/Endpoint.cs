using Carter;
using Resume_builder.Common;

namespace Resume_builder.Features.Project.Delete;

public class DeleteProjectEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGroup("project")
            .WithTags("Project")
            .RequireAuthorization()
            .MapDelete("{projectId}", async (
                string projectId,
                DeleteProjectHandler handler,
                CancellationToken cancellationToken) =>
            {
                var response = await handler.Handle(new DeleteProjectCommand(projectId), cancellationToken);

                return response.GetResult();
            })
            .WithName("Delete Project");
    }
}
