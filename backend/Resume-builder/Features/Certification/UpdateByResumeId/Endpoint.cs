using Carter;
using Resume_builder.Common;
using Resume_builder.Features.Certification.Update;

namespace Resume_builder.Features.Certification.UpdateByResumeId;

public class UpdateCertificationByResumeIdEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGroup("certification")
            .WithTags("Certification")
            .RequireAuthorization()
            .MapPut("/resume/{resumeId}", async (
                string resumeId,
                List<UpdateCertificationRequest> request,
                UpdateCertificationByResumeIdHandler handler,
                CancellationToken cancellationToken) =>
            {
                var response = await handler.Handle(new UpdateCertificationByResumeIdCommand(resumeId, request), cancellationToken);

                return response.GetResult();
            });
    }
}
