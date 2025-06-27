namespace Resume_builder.Features.Resume.Update;

public record UpdateResumeCommand(string ResumeId, UpdateResumeRequest Request);

public class UpdateResumeRequest
{
    public string? UserName { get; set; } = string.Empty;
    public string? ResumeName { get; set; } = string.Empty;
    public string? Email { get; set; } = string.Empty;
    public string? Summary { get; set; }
    public string? Role { get; set; }
    public string? Address { get; set; }
    public string? PhoneNumber { get; set; }
    public string? Tags { get; set; } = string.Empty;
    public bool IsFavourite { get; set; }

    public string? LinkedinUrl { get; set; }
    public string? GithubUrl { get; set; }
    public string? PortfolioUrl { get; set; }
}