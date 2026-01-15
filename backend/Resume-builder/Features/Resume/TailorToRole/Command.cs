namespace Resume_builder.Features.Resume.TailorToRole;

public record TailorResumeCommand(string ResumeId, string TargetRole);

/// <summary>
/// Response containing the suggested changes for tailoring a resume to a specific role
/// </summary>
public class TailorResumeResponse
{
    public string ResumeId { get; set; } = string.Empty;
    public string TargetRole { get; set; } = string.Empty;
    public string SuggestedOrder { get; set; } = string.Empty;
    public string? SuggestedSummary { get; set; }
    public List<string> RecommendedSections { get; set; } = new();
    public Dictionary<string, string> SectionPriorities { get; set; } = new();
}
