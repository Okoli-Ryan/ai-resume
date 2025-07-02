using System.Net;
using Resume_builder.Common;
using Resume_builder.Infrastructure.Services.AIChatClient;
using Resume_builder.Infrastructure.Services.AIChatClient.Common;
using Resume_builder.Infrastructure.Services.ClaimService;

namespace Resume_builder.Features.Resume.EnhanceSkills;

public class EnhanceSkillsHandler(IClaimsService claimsService, IAIChatClient chatClient)
    : IResponseHandler<EnhanceSkillsCommand, List<EnhanceSkillsResponse>>
{
    public async Task<Response<List<EnhanceSkillsResponse>>> Handle(EnhanceSkillsCommand command,
        CancellationToken cancellationToken)
    {
        var userId = claimsService.GetUserId();

        if (userId is null)
            return Response<List<EnhanceSkillsResponse>>.Fail(HttpStatusCode.Unauthorized, "Unauthorized");

        var response = await chatClient.EnhanceSkills(command.Skills, command.AdditionalInfo, cancellationToken);

        return Response<List<EnhanceSkillsResponse>>.Success(response.Response);
    }
}