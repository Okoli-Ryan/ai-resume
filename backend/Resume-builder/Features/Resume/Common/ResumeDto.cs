using Resume_builder.Common;
using Resume_builder.Features.Certification.Common;
using Resume_builder.Features.Education.Common;
using Resume_builder.Features.Link;
using Resume_builder.Features.Project.Common;
using Resume_builder.Features.Skills.Common;
using Resume_builder.Features.WorkExperience.Common;

namespace Resume_builder.Features.Resume.Common;

public class ResumeDto : BaseEntity
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

    public virtual List<ProjectDto>? Projects { get; set; }
    public virtual List<EducationDto>? Education { get; set; }
    public virtual List<WorkExperienceDto>? WorkExperience { get; set; }
    public virtual List<SkillDto>? Skills { get; set; }
    public virtual List<LinkDto>? Links { get; set; }
    public virtual List<CertificationDto>? Certifications { get; set; }
}