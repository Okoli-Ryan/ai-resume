using Resume_builder.Infrastructure.Services.AIChatClient.Common;

namespace Resume_builder.Features.Resume.ImportResume;

public record ImportResumeCommand(string Base64String, ResumeAdditionalInfo? additionalInfo);