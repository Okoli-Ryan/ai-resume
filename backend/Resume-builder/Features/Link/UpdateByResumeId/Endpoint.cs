using Carter;
using Resume_builder.Common;

namespace Resume_builder.Features.Link.UpdateByResumeId;

public class UpdateLinksByResumeIdEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGroup("link")
            .WithTags("Link")
            .MapPut("resume/{resumeId}", async (
                string resumeId,
                List<UpdateLinksByResumeIdRequest> request,
                UpdateLinksByResumeIdHandler handler,
                CancellationToken cancellationToken) =>
            {
                var response = await handler.Handle(new UpdateLinksByResumeIdCommand(resumeId, request), cancellationToken);

                return response.GetResult();
            });
    }
}
