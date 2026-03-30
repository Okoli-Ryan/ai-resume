using Carter;
using Resume_builder.Common;

namespace Resume_builder.Features.WorkExperience.Create;

public class CreateWorkExperienceEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGroup("work-experience")
            .WithTags("Work Experience")
            .RequireAuthorization()
            .MapPost("", async (
                CreateWorkExperienceCommand command,
                CreateWorkExperienceValidator validator,
                CreateWorkExperienceHandler handler,
                CancellationToken cancellationToken) =>
            {
                var validationError = await validator.ValidateRequest(command);
                if (validationError != null)
                    return Results.BadRequest(validationError);

                var result = await handler.Handle(command, cancellationToken);

                return result.GetResult();
            })
            .WithName("Create Work Experience");
    }
}
