using Resume_builder.Common;
using Resume_builder.Features.BulletPoint.Common;

namespace Resume_builder.Features.WorkExperience.Common;

public class WorkExperienceDto : BaseEntity
{
    public required string ResumeId { get; set; }
    public string? CompanyName { get; set; }
    public string? CompanyLink { get; set; }
    public string? Title { get; set; }
    public string? WorkType { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public bool IsOngoing { get; set; }
    public string? Location { get; set; }
    public string UserId { get; set; }
    public List<BulletPointDto>? BulletPoints { get; set; }
}