using Carter;
using Resume_builder.Common;

namespace Resume_builder.Features.WorkExperience.Delete;

public class DeleteWorkExperienceEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGroup("work-experience")
            .WithTags("Work Experience")
            .RequireAuthorization()
            .MapDelete("{workExperienceId}", async (
                string workExperienceId,
                DeleteWorkExperienceHandler handler,
                CancellationToken cancellationToken) =>
            {
                var response = await handler.Handle(new DeleteWorkExperienceCommand(workExperienceId), cancellationToken);

                return response.GetResult();
            })
            .WithName("Delete Work Experience");
    }
}
