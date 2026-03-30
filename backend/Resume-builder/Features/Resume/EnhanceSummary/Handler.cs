using System.Net;
using Resume_builder.Common;
using Resume_builder.Infrastructure.Services.AIChatClient;
using Resume_builder.Infrastructure.Services.AIChatClient.Common;
using Resume_builder.Infrastructure.Services.ClaimService;

namespace Resume_builder.Features.Resume.Enhance_Summary;

public class EnhanceSummaryHandler(IClaimsService claimsService, IAIChatClient chatClient) : IResponseHandler<EnhanceSummaryCommand, EnhanceSummaryResponse>
{
    public async Task<Response<EnhanceSummaryResponse>> Handle(EnhanceSummaryCommand command, CancellationToken cancellationToken)
    {
        var userId = claimsService.GetUserId();
        
        if(userId is null)
            return Response<EnhanceSummaryResponse>.Fail(HttpStatusCode.Unauthorized, "Unauthorized");

        var response = await chatClient.EnhanceSummary(command.Summary, command.AdditionalInfo, cancellationToken);
        
        return Response<EnhanceSummaryResponse>.Success(response.Response);
    }
}