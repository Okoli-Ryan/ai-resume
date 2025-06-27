namespace Resume_builder.Features.WorkExperience.Enhance;

public record enhanceExperienceBulletPointsCommand(
    string WorkExperienceId,
    EnhanceWorkExperienceBulletPointAdditionalInfo AdditionalInfo);

public class EnhanceWorkExperienceBulletPointAdditionalInfo
{
    public string? Role { get; set; }
    public string? Tags { get; set; }
}