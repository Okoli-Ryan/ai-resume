using Carter;
using Resume_builder.Common;
using Resume_builder.Features.Resume.Common;
using Resume_builder.Infrastructure.Services.AIChatClient;
using Resume_builder.Infrastructure.Services.ClaimService;

namespace Resume_builder.Features.Resume.Enhance_Summary;

public class EnhanceSummaryEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        var endpoint = app.MapGroup(ResumeConstants.ResumeMapGroupName).WithTags(ResumeConstants.ResumeMapGroupTag).RequireAuthorization();
        
        endpoint.MapPost("enhance/summary", async (
            IClaimsService claimsService,
            IAIChatClient chatClient,
            EnhanceSummaryCommand command,
            CancellationToken cancellationToken
        ) =>
        {
            var handler = new EnhanceSummaryHandler(claimsService, chatClient);
            var response = await handler.Handle(command, cancellationToken);

            return response.GetResult();
        });
    }
}