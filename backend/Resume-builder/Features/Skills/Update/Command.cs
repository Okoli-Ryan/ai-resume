namespace Resume_builder.Features.Skills.Update;

public record UpdateSkillCommand(string SkillId, UpdateSkillRequest Request)
{
}

public class UpdateSkillRequest
{
    public string Category { get; set; } = string.Empty;
    public string Skills { get; set; } = string.Empty;
}