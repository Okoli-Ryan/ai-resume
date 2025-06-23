using Resume_builder.Common;
using Resume_builder.Features.BulletPoint.Common;
using Resume_builder.Features.Resume.Common;
using Resume_builder.Features.Users;

namespace Resume_builder.Features.Project.Common;

public class ProjectDto : BaseEntity
{
    public string? Name { get; set; } = string.Empty;

    public string? Link { get; set; } = string.Empty;

    public string UserId { get; set; }
    public virtual User? User { get; set; }
    public string ResumeId { get; set; }

    public virtual ResumeDto? Resume { get; set; }

    public List<BulletPointDto>? BulletPoints { get; set; }
}