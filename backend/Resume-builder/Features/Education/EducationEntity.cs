using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Resume_builder.Common;
using Resume_builder.Features.BulletPoint;
using Resume_builder.Features.Resume;
using Resume_builder.Features.Users;

namespace Resume_builder.Features.Education;

public class EducationEntity : BaseEntity
{
    [MaxLength(100)] public string? SchoolName { get; set; }

    [MaxLength(100)] public string? Degree { get; set; }

    [MaxLength(100)] public string? FieldOfStudy { get; set; }

    [MaxLength(100)] public string? Location { get; set; }

    public bool IsOngoing { get; set; }

    public DateTime? StartDate { get; set; }

    public DateTime? EndDate { get; set; }

    public required string ResumeId { get; set; }

    public required string UserId { get; set; }

    public virtual ResumeEntity? Resume { get; set; }

    public virtual User? User { get; set; }
    public List<BulletPointEntity> BulletPoints { get; set; } = [];

}