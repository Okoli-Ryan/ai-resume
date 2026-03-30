using Carter;
using Resume_builder.Common;

namespace Resume_builder.Features.Skills.GetByResumeId;

public class GetSkillsByResumeIdEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGroup("skill")
            .RequireAuthorization()
            .MapGet("/resume/{resumeId}", async (
                string resumeId,
                GetSkillsByResumeIdHandler handler,
                CancellationToken cancellationToken) =>
            {
                var response = await handler.Handle(resumeId, cancellationToken);

                return response.GetResult();
            });
    }
}
