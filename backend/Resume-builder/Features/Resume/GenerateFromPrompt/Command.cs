using Resume_builder.Infrastructure.Services.AIChatClient.Common;

namespace Resume_builder.Features.Resume.GenerateFromPrompt;

public record GenerateFromPromptCommand(string Prompt, ResumeAdditionalInfo? AdditionalInfo);