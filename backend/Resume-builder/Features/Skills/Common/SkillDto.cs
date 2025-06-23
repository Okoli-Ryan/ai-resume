using Resume_builder.Common;

namespace Resume_builder.Features.Skills.Common;

public class SkillDto : BaseEntity
{
    public string Category { get; set; } = string.Empty;
    public string Skills { get; set; } = string.Empty;
    public required string UserId { get; set; }
    public required string ResumeId { get; set; }
}