using Carter;
using Resume_builder.Common;
using Resume_builder.Features.Resume.Common;

namespace Resume_builder.Features.Resume.Enhance_Summary;

public class EnhanceSummaryEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        var endpoint = app.MapGroup(ResumeConstants.ResumeMapGroupName).WithTags(ResumeConstants.ResumeMapGroupTag).RequireAuthorization();

        endpoint.MapPost("enhance/summary", async (
            EnhanceSummaryCommand command,
            EnhanceSummaryHandler handler,
            CancellationToken cancellationToken
        ) =>
        {
            var response = await handler.Handle(command, cancellationToken);

            return response.GetResult();
        });
    }
}