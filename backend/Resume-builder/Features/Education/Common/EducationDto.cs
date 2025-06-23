using Resume_builder.Common;
using Resume_builder.Features.BulletPoint.Common;

namespace Resume_builder.Features.Education.Common;

public class EducationDto : BaseEntity
{
    public string? SchoolName { get; set; }

    public string? Degree { get; set; }

    public string? FieldOfStudy { get; set; }

    public string? Location { get; set; }

    public bool IsOngoing { get; set; }

    public DateTime? StartDate { get; set; }

    public DateTime? EndDate { get; set; }

    public required string ResumeId { get; set; }

    public required string UserId { get; set; }
    public List<BulletPointDto> BulletPoints { get; set; }
}