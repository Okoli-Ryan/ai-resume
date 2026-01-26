namespace Resume_builder.Features.Education.PatchUpdate;

public record PatchUpdateEducationCommand(string EducationId, PatchUpdateEducationRequest Request);

public class PatchUpdateEducationRequest
{
    public string? SchoolName { get; set; }
    public string? Degree { get; set; }
    public string? FieldOfStudy { get; set; }
    public string? Location { get; set; }
    public bool? IsOngoing { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
}
