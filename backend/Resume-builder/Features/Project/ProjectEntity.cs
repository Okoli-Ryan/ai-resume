using System.ComponentModel.DataAnnotations;
using Resume_builder.Common;
using Resume_builder.Features.BulletPoint;
using Resume_builder.Features.Resume;
using Resume_builder.Features.Users;

namespace Resume_builder.Features.Project;

public class ProjectEntity : BaseEntity
{
    [MaxLength(100)] public string? ProjectName { get; set; } = string.Empty;

    [MaxLength(256)] public string? ProjectUrl { get; set; } = string.Empty;

    public string ResumeId { get; set; }

    public string UserId { get; set; }
    public virtual ResumeEntity? Resume { get; set; }
    public virtual User? User { get; set; }
    public List<BulletPointEntity> BulletPoints { get; set; } = [];
}