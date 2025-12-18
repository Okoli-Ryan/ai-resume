using Resume_builder.Common;

namespace Resume_builder.Features.BulletPoint.Common;

public class BulletPointDto : BaseEntity
{
    public string Text { get; set; } = string.Empty;
    public int Order { get; set; }
    public string? EducationId { get; set; }
    public string? ProjectId { get; set; }
    public string? WorkExperienceId { get; set; }
    public string? CertificationId { get; set; }
}