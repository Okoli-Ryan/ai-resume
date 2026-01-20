namespace Resume_builder.Features.Resume.Patch_Update_Summary;

public record PatchUpdateSummaryCommand(string ResumeId, PatchUpdateSummaryRequest Request);

public class PatchUpdateSummaryRequest
{
    public string? Summary { get; set; }
}
