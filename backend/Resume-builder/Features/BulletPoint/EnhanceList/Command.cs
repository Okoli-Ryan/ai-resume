using Resume_builder.Common;
using Resume_builder.Infrastructure.Services.AIChatClient.Common;

namespace Resume_builder.Features.BulletPoint.EnhanceList;

public record EnhanceExperienceBulletPointsCommand(
    EnhanceTypes EnhanceType,
    EnhanceExperienceBulletPointsRequest Request);

public record EnhanceExperienceBulletPointsRequest(
    List<string> BulletPoints,
    ResumeAdditionalInfo AdditionalInfo);