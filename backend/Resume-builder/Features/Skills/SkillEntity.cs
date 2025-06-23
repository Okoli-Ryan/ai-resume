using Resume_builder.Common;

namespace Resume_builder.Features.Skills;

public class SkillEntity : BaseEntity
{
    public string Group { get; set; } = string.Empty;
    public string Skills { get; set; } = string.Empty;
    public required string UserId { get; set; }
    public required string ResumeId { get; set; }
}