using Carter;
using Resume_builder.Common;

namespace Resume_builder.Features.Project.Update;

public class UpdateProjectEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGroup("project")
            .WithTags("Project")
            .RequireAuthorization()
            .MapPut("{id}", async (
                string id,
                UpdateProjectRequest request,
                UpdateProjectValidator validator,
                UpdateProjectHandler handler,
                CancellationToken cancellationToken) =>
            {
                var validationError = await validator.ValidateRequest(request);
                if (validationError != null)
                    return Results.BadRequest(validationError);

                var response = await handler.Handle(new UpdateProjectCommand(id, request), cancellationToken);

                return response.GetResult();
            });
    }
}
