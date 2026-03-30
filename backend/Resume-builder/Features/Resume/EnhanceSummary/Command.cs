using Resume_builder.Infrastructure.Services.AIChatClient.Common;

namespace Resume_builder.Features.Resume.Enhance_Summary;

public record EnhanceSummaryCommand(string Summary, ResumeAdditionalInfo AdditionalInfo);