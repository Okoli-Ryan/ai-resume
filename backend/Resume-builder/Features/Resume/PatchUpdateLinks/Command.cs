namespace Resume_builder.Features.Resume.PatchUpdateLinks;

public record PatchUpdateLinksCommand(string ResumeId, PatchUpdateLinksRequest Request);

public class PatchUpdateLinksRequest
{
    public string? LinkedinUrl { get; set; }
    public string? GithubUrl { get; set; }
    public string? PortfolioUrl { get; set; }
}
