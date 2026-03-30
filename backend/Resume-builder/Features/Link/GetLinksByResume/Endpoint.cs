using Carter;
using Resume_builder.Common;

namespace Resume_builder.Features.Link.GetLinksByResume;

public class GetLinksByResumeEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGroup("link")
            .WithTags("Link")
            .MapGet("resume/{resumeId}", async (
                string resumeId,
                GetLinksByResumeHandler handler,
                CancellationToken cancellationToken) =>
            {
                var response = await handler.Handle(new GetLinksByResumeQuery(resumeId), cancellationToken);

                return response.GetResult();
            });
    }
}
