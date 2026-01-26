namespace Resume_builder.Features.Project.PatchUpdate;

public record PatchUpdateProjectCommand(string ProjectId, PatchUpdateProjectRequest Request);

public class PatchUpdateProjectRequest
{
    public string? ProjectName { get; set; }
    public string? ProjectUrl { get; set; }
}
