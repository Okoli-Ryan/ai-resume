using System.Net;
using Microsoft.EntityFrameworkCore;
using Resume_builder.Common;
using Resume_builder.Features.WorkExperience.Enhance;
using Resume_builder.Infrastructure.Persistence.Data;
using Resume_builder.Infrastructure.Services.AIChatClient;
using Resume_builder.Infrastructure.Services.AIChatClient.Common;
using Resume_builder.Infrastructure.Services.ClaimService;

namespace Resume_builder.Features.BulletPoint.Enhance_WorkExperience;

public class EnhanceWorkExperienceBulletPointsHandler(
    IAIChatClient chatClient,
    AppDbContext db,
    IClaimsService claimsService) : IResponseHandler<enhanceExperienceBulletPointsCommand, List<string>>
{
    public async Task<Response<List<string>>> Handle(enhanceExperienceBulletPointsCommand command,
        CancellationToken cancellationToken)
    {
        var userId = claimsService.GetUserId();

        if (userId == null)
            return Response<List<string>>.Fail(HttpStatusCode.Unauthorized, "Unauthorized");

        var bulletPoints = await db.BulletPoint
            .Where(bp => bp.WorkExperienceId == command.WorkExperienceId)
            .Select(x => x.Text)
            .ToListAsync(cancellationToken);

        var request = new EnhanceWorkExperienceBulletPointsRequest
        {
            BulletPoints = bulletPoints,
            Role = command.AdditionalInfo.Role,
            Tags = command.AdditionalInfo.Tags
        };

        var bulletPointSuggestions = await chatClient.EnhanceWorkExperienceBulletPoints(request, cancellationToken);

        return Response<List<string>>.Success(bulletPointSuggestions.Response?.BulletPoints ?? []);
    }
}