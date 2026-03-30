using Carter;
using Resume_builder.Common;
using Resume_builder.Features.Skills.Update;

namespace Resume_builder.Features.Skills.UpdateByResumeId;

public class UpdateSkillsByResumeIdEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGroup("skill")
            .RequireAuthorization()
            .MapPut("/resume/{resumeId}", async (
                string resumeId,
                List<UpdateSkillRequest> request,
                UpdateSkillsByResumeIdHandler handler,
                CancellationToken cancellationToken) =>
            {
                var response = await handler.Handle(new UpdateSkillsByResumeIdCommand(resumeId, request), cancellationToken);

                return response.GetResult();
            });
    }
}
