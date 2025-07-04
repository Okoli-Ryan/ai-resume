using Resume_builder.Infrastructure.Services.AIChatClient.Common;

namespace Resume_builder.Features.Resume.EnhanceSkills;

public record EnhanceSkillsCommand(List<string> Skills, ResumeAdditionalInfo AdditionalInfo);