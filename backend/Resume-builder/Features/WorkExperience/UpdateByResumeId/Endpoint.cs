using Carter;
using Resume_builder.Common;
using Resume_builder.Features.WorkExperience.Update;

namespace Resume_builder.Features.WorkExperience.UpdateByResumeId;

public class UpdateWorkExperienceByResumeIdEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGroup("work-experience")
            .WithTags("Work Experience")
            .RequireAuthorization()
            .MapPut("/resume/{resumeId}", async (
                string resumeId,
                List<UpdateWorkExperienceRequest> request,
                UpdateWorkExperienceByResumeIdHandler handler,
                CancellationToken cancellationToken) =>
            {
                var response = await handler.Handle(new UpdateWorkExperienceByResumeIdCommand(resumeId, request), cancellationToken);

                return response.GetResult();
            });
    }
}
