namespace Resume_builder.Features.Resume.PatchUpdate;

public record PatchUpdateResumeCommand(string ResumeId, PatchUpdateResumeRequest Request);

public class PatchUpdateResumeRequest
{
    public string? UserName { get; set; }
    public string? ResumeName { get; set; }
    public string? Email { get; set; }
    public string? Summary { get; set; }
    public string? Role { get; set; }
    public string? Order { get; set; }
    public string? Address { get; set; }
    public string? PhoneNumber { get; set; }
    public string? Tags { get; set; }
    public bool? IsFavourite { get; set; }
    public string? LinkedinUrl { get; set; }
    public string? GithubUrl { get; set; }
    public string? PortfolioUrl { get; set; }
}
