namespace Resume_builder.Features.Skills.PatchUpdate;

public record PatchUpdateSkillCommand(string SkillId, PatchUpdateSkillRequest Request);

public class PatchUpdateSkillRequest
{
    public string? Category { get; set; }
    public string? Skills { get; set; }
}
