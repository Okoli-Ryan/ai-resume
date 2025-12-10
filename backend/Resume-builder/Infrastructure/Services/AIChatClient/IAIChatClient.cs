using Microsoft.Extensions.AI;
using Resume_builder.Common;
using Resume_builder.Features.Resume;
using Resume_builder.Infrastructure.Services.AIChatClient.Common;

namespace Resume_builder.Infrastructure.Services.AIChatClient;

public interface IAIChatClient : IChatClient
{
    Task<AIResponse<string>> EnhanceBulletPoint(EnhanceBulletPointRequest request, CancellationToken cancellationToken);

    Task<AIResponse<EnhanceBulletPointsResponse?>> EnhanceBulletPoints(
        EnhanceTypes enhanceType,
        EnhanceBulletPointsRequest request,
        CancellationToken cancellationToken);

    Task<AIResponse<GenerateResumeResponse?>> GenerateResume(ResumeEntity resume, ResumeAdditionalInfo? additionalInfo,
        CancellationToken cancellationToken);

    Task<AIResponse<EnhanceSummaryResponse>> EnhanceSummary(string summary, ResumeAdditionalInfo? additionalInfo,
        CancellationToken cancellationToken);

    Task<AIResponse<List<EnhanceSkillsResponse>>> EnhanceSkills(List<string> skills,
        ResumeAdditionalInfo? additionalInfo, CancellationToken cancellationToken);

    Task<AIResponse<ParsedResumeResponse>> ParseResume(string rawText, ResumeAdditionalInfo additionalInfo,
        CancellationToken cancellationToken);
}