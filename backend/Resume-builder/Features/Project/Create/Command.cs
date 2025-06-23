using Resume_builder.Features.BulletPoint.Common;
using Resume_builder.Features.Resume;

namespace Resume_builder.Features.Project.Create;

public class CreateProjectCommand
{
    public string? Name { get; set; } = string.Empty;

    public string? Link { get; set; } = string.Empty;

    public int Order { get; set; }

    public string ResumeId { get; set; }

    public virtual ResumeEntity? Resume { get; set; }

    public List<BulletPointDto> BulletPoints { get; set; }
}