namespace Resume_builder.Features.Skills.Create;

public class CreateSkillCommand
{
    public string Group { get; set; } = string.Empty;
    public string Skills { get; set; } = string.Empty;
    public required string ResumeId { get; set; } = string.Empty;
}