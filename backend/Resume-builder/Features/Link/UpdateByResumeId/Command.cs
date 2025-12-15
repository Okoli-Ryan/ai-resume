namespace Resume_builder.Features.Link.UpdateByResumeId;

public record UpdateLinksByResumeIdCommand(string ResumeId, List<UpdateLinksByResumeIdRequest> Links);

public class UpdateLinksByResumeIdRequest
{
    public string LinkName { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
    public int Index { get; set; }
}
