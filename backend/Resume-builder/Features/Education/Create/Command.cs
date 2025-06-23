using Resume_builder.Features.BulletPoint.Common;

namespace Resume_builder.Features.Education.Create;

public class CreateEducationCommand
{
    public string? SchoolName { get; set; }

    public string? Degree { get; set; }

    public string? FieldOfStudy { get; set; }

    public string? Location { get; set; }

    public bool IsOngoing { get; set; }

    public DateTime? StartDate { get; set; }

    public DateTime? EndDate { get; set; }

    public required string ResumeId { get; set; }

    public List<BulletPointDto> BulletPoints { get; set; }
}