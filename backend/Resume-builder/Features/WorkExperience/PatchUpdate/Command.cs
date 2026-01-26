namespace Resume_builder.Features.WorkExperience.PatchUpdate;

public record PatchUpdateWorkExperienceCommand(string WorkExperienceId, PatchUpdateWorkExperienceRequest Request);

public class PatchUpdateWorkExperienceRequest
{
    public string? CompanyName { get; set; }
    public string? CompanyLink { get; set; }
    public string? Title { get; set; }
    public string? WorkType { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public bool? IsOngoing { get; set; }
    public string? Location { get; set; }
}
