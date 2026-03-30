using Carter;
using Resume_builder.Common;

namespace Resume_builder.Features.Project.PatchUpdate;

public class PatchUpdateProjectEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGroup("project")
            .WithTags("Project")
            .RequireAuthorization()
            .MapPatch("{id}", async (
                string id,
                PatchUpdateProjectRequest request,
                PatchUpdateProjectValidator validator,
                PatchUpdateProjectHandler handler,
                CancellationToken cancellationToken) =>
            {
                var validationError = await validator.ValidateRequest(request);
                if (validationError != null)
                    return Results.BadRequest(validationError);

                var response = await handler.Handle(new PatchUpdateProjectCommand(id, request), cancellationToken);

                return response.GetResult();
            });
    }
}
