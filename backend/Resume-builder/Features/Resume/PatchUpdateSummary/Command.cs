namespace Resume_builder.Features.Resume.PatchUpdateSummary;

public record PatchUpdateSummaryCommand(string ResumeId, PatchUpdateSummaryRequest Request);

public class PatchUpdateSummaryRequest
{
    public string? Summary { get; set; }
}
