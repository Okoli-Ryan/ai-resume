namespace Resume_builder.Features.Resume.Patch;

public record PatchResumeCommand(string ResumeId, PatchResumeRequest Request);

/// <summary>
/// Request for partially updating a resume. All fields are optional.
/// Only provided (non-null) fields will be updated.
/// </summary>
public class PatchResumeRequest
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
