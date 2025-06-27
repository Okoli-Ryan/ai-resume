using Microsoft.Extensions.AI;
using Resume_builder.Features.Resume;
using Resume_builder.Infrastructure.Services.AIChatClient.Common;

namespace Resume_builder.Infrastructure.Services.AIChatClient;

public interface IAIChatClient : IChatClient
{
    Task<AIResponse<string>> EnhanceBulletPoint(EnhanceBulletPointRequest request, CancellationToken cancellationToken);

    Task<AIResponse<EnhanceWorkExperienceBulletPointsResponse?>> EnhanceWorkExperienceBulletPoints(
        EnhanceWorkExperienceBulletPointsRequest request,
        CancellationToken cancellationToken);

    Task<AIResponse<GenerateResumeResponse?>> GenerateResume(ResumeEntity resume, ResumeAdditionalInfo? additionalInfo,
        CancellationToken cancellationToken);
}