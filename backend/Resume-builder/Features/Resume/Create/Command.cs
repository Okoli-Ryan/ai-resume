using Resume_builder.Features.Education.Create;
using Resume_builder.Features.Project.Create;
using Resume_builder.Features.Skills.Create;
using Resume_builder.Features.WorkExperience.Create;

namespace Resume_builder.Features.Resume.Create;

public class CreateResumeCommand
{
    public string? UserName { get; set; } = string.Empty;
    public string? ResumeName { get; set; } = string.Empty;
    public string? Email { get; set; } = string.Empty;
    public string? Summary { get; set; }
    public string? Role { get; set; }
    public string? Address { get; set; }
    public string? PhoneNumber { get; set; }
    public string? LinkedinUrl { get; set; }
    public string? GithubUrl { get; set; }
    public string? PortfolioUrl { get; set; }
    public string? Tags { get; set; } = string.Empty;
    public List<CreateEducationCommand>? Education { get; set; }

    public List<CreateWorkExperienceCommand>? WorkExperience { get; set; }
    public List<CreateSkillCommand>? Skills { get; set; }
    public List<CreateProjectCommand>? Projects { get; set; }
}