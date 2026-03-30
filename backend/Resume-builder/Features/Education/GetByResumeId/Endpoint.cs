using Carter;
using Resume_builder.Common;

namespace Resume_builder.Features.Education.GetByResumeId;

public class GetEducationByResumeIdEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGroup("education")
            .WithTags("Education")
            .RequireAuthorization()
            .MapGet("/resume/{resumeId}", async (
                string resumeId,
                GetEducationByResumeIdHandler handler,
                CancellationToken cancellationToken) =>
            {
                var response = await handler.Handle(resumeId, cancellationToken);

                return response.GetResult();
            });
    }
}
