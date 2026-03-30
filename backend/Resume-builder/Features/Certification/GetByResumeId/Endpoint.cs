using Carter;
using Resume_builder.Common;

namespace Resume_builder.Features.Certification.GetByResumeId;

public class GetCertificationsByResumeIdEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGroup("certification")
            .WithTags("Certification")
            .RequireAuthorization()
            .MapGet("/resume/{resumeId}", async (
                string resumeId,
                GetCertificationsByResumeIdHandler handler,
                CancellationToken cancellationToken) =>
            {
                var response = await handler.Handle(resumeId, cancellationToken);

                return response.GetResult();
            });
    }
}
