using System.Net;
using Resume_builder.Common;
using Resume_builder.Infrastructure.Services.AIChatClient;
using Resume_builder.Infrastructure.Services.AIChatClient.Common;
using Resume_builder.Infrastructure.Services.ClaimService;

namespace Resume_builder.Features.BulletPoint.Enhance_List;

public class EnhanceBulletPointsHandler(
    IAIChatClient chatClient,
    IClaimsService claimsService) : IResponseHandler<EnhanceExperienceBulletPointsCommand, List<string>>
{
    public async Task<Response<List<string>>> Handle(EnhanceExperienceBulletPointsCommand command,
        CancellationToken cancellationToken)
    {
        var userId = claimsService.GetUserId();

        if (userId == null)
            return Response<List<string>>.Fail(HttpStatusCode.Unauthorized, "Unauthorized");

        var request = command.Request;

        if (request.BulletPoints.Count == 0)
            return Response<List<string>>.Fail(HttpStatusCode.BadRequest, "No bullet points provided");

        var enhanceBulletPointsRequest = new EnhanceBulletPointsRequest
        {
            BulletPoints = request.BulletPoints,
            Role = request.AdditionalInfo.Role,
            JobDescription = request.AdditionalInfo.JobDescription,
            Tags = request.AdditionalInfo.Tags
        };

        var bulletPointSuggestions =
            await chatClient.EnhanceBulletPoints(command.EnhanceType, enhanceBulletPointsRequest, cancellationToken);

        return Response<List<string>>.Success(bulletPointSuggestions.Response?.BulletPoints ?? []);
    }
}