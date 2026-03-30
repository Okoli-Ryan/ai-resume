using Carter;
using Resume_builder.Common;

namespace Resume_builder.Features.Project.Create;

public class CreateProjectEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGroup("project")
            .WithTags("Project")
            .RequireAuthorization()
            .MapPost("", async (
                CreateProjectCommand command,
                CreateProjectValidator validator,
                CreateProjectHandler handler,
                CancellationToken cancellationToken) =>
            {
                var validationError = await validator.ValidateRequest(command);
                if (validationError != null)
                    return Results.BadRequest(validationError);

                var response = await handler.Handle(command, cancellationToken);

                return response.GetResult();
            });
    }
}
