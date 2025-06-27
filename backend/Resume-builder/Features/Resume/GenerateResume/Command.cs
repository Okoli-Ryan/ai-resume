using Resume_builder.Infrastructure.Services.AIChatClient.Common;

namespace Resume_builder.Features.Resume.GenerateResume;

public record GenerateResumeCommand(string ResumeId, ResumeAdditionalInfo? AdditionalInfo);