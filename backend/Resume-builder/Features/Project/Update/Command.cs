using Resume_builder.Features.BulletPoint.Common;

namespace Resume_builder.Features.Project.Update;

public record UpdateProjectCommand(string ProjectId, UpdateProjectRequest Request);

public class UpdateProjectRequest
{
    public string? Name { get; set; }

    public string? Link { get; set; }
    
    public List<BulletPointDto> BulletPoints { get; set; }
}