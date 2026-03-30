using Carter;
using Resume_builder.Common;

namespace Resume_builder.Features.WorkExperience.GetByResumeId;

public class GetWorkExperienceByResumeIdEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGroup("work-experience")
            .WithTags("Work Experience")
            .RequireAuthorization()
            .MapGet("/resume/{resumeId}", async (
                string resumeId,
                GetWorkExperienceByResumeIdHandler handler,
                CancellationToken cancellationToken) =>
            {
                var response = await handler.Handle(resumeId, cancellationToken);

                return response.GetResult();
            });
    }
}
