using Resume_builder.Common;

namespace Resume_builder.Features.Resume.GetResumeInfo;

public class ResumeInfoDto : BaseEntity
{
    public string? UserName { get; set; } = string.Empty;
    public string? ResumeName { get; set; } = string.Empty;
    public string? Email { get; set; } = string.Empty;
    public string? Summary { get; set; } = string.Empty;
    public string? Role { get; set; } = string.Empty;
    public string? Address { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; } = string.Empty;
    public string? Tags { get; set; } = string.Empty;
    public string? LinkedinUrl { get; set; }
    public string? GithubUrl { get; set; }
    public string? PortfolioUrl { get; set; }
    public string? Order { get; set; } = string.Empty;
    public string UserId { get; set; } = string.Empty;
    public bool IsFavourite { get; set; }
}
