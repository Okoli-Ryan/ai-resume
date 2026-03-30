using Carter;
using Resume_builder.Common;

namespace Resume_builder.Features.WorkExperience.Update;

public class UpdateWorkExperienceEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGroup("work-experience")
            .WithTags("Work Experience")
            .RequireAuthorization()
            .MapPut("{workExperienceId}", async (
                string workExperienceId,
                UpdateWorkExperienceRequest request,
                UpdateWorkExperienceValidator validator,
                UpdateWorkExperienceHandler handler,
                CancellationToken cancellationToken) =>
            {
                var validationError = await validator.ValidateRequest(request);
                if (validationError != null)
                    return Results.BadRequest(validationError);

                var command = new UpdateWorkExperienceCommand(workExperienceId, request);

                var result = await handler.Handle(command, cancellationToken);

                return Results.Ok(result);
            })
            .WithName("Update Work Experience");
    }
}
