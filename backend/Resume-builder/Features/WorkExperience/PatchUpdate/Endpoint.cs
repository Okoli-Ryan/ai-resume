using Carter;
using Resume_builder.Common;

namespace Resume_builder.Features.WorkExperience.PatchUpdate;

public class PatchUpdateWorkExperienceEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGroup("work-experience")
            .WithTags("Work Experience")
            .RequireAuthorization()
            .MapPatch("{workExperienceId}", async (
                string workExperienceId,
                PatchUpdateWorkExperienceRequest request,
                PatchUpdateWorkExperienceValidator validator,
                PatchUpdateWorkExperienceHandler handler,
                CancellationToken cancellationToken) =>
            {
                var validationError = await validator.ValidateRequest(request);
                if (validationError != null)
                    return Results.BadRequest(validationError);

                var command = new PatchUpdateWorkExperienceCommand(workExperienceId, request);

                var result = await handler.Handle(command, cancellationToken);

                return result.GetResult();
            })
            .WithName("Patch Update Work Experience");
    }
}
