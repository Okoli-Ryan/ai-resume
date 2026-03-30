using Carter;
using Resume_builder.Common;
using Resume_builder.Features.Education.Update;

namespace Resume_builder.Features.Education.UpdateByResumeId;

public class UpdateEducationByResumeIdEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGroup("education")
            .WithTags("Education")
            .RequireAuthorization()
            .MapPut("/resume/{resumeId}", async (
                string resumeId,
                List<UpdateEducationRequest> request,
                UpdateEducationByResumeIdHandler handler,
                CancellationToken cancellationToken) =>
            {
                var response = await handler.Handle(new UpdateEducationByResumeIdCommand(resumeId, request), cancellationToken);

                return response.GetResult();
            });
    }
}
