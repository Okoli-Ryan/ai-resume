using Resume_builder.Common;
using Resume_builder.Infrastructure.Services.AIChatClient.Common;

namespace Resume_builder.Features.BulletPoint.Enhance_List;

public record EnhanceExperienceBulletPointsCommand(
    EnhanceTypes EnhanceType,
    EnhanceExperienceBulletPointsRequest Request);

public record EnhanceExperienceBulletPointsRequest(
    List<string> BulletPoints,
    ResumeAdditionalInfo AdditionalInfo);