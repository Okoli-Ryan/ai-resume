using System.ComponentModel.DataAnnotations;
using Resume_builder.Common;
using Resume_builder.Features.BulletPoint;
using Resume_builder.Features.Resume;
using Resume_builder.Features.Users;

namespace Resume_builder.Features.WorkExperience;

public class WorkExperienceEntity : BaseEntity
{
    public required string ResumeId { get; set; }
    public required string UserId { get; set; }

    [MaxLength(128)] public string? CompanyName { get; set; }
    [MaxLength(128)] public string? CompanyLink { get; set; }
    [MaxLength(128)] public string? Title { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public bool IsOngoing { get; set; } = true;
    [MaxLength(128)] public string? Location { get; set; }
    [MaxLength(32)] public string? WorkType { get; set; }
    
    public virtual ResumeEntity? Resume { get; set; }
    public virtual User? User { get; set; }
    public List<BulletPointEntity> BulletPoints { get; set; } = [];
}
