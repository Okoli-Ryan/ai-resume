using System.ComponentModel.DataAnnotations;
using Resume_builder.Common;
using Resume_builder.Features.Education;
using Resume_builder.Features.Project;
using Resume_builder.Features.Skills;
using Resume_builder.Features.Users;
using Resume_builder.Features.WorkExperience;

namespace Resume_builder.Features.Resume;

public class ResumeEntity : BaseEntity
{
    [MaxLength(100)] public string? ResumeName { get; set; } = string.Empty;

    [MaxLength(100)] public string? UserFullName { get; set; } = string.Empty;

    [EmailAddress] [MaxLength(128)] public string? UserEmail { get; set; } = string.Empty;

    [MaxLength(2000)] public string? TextSummary { get; set; } = string.Empty;

    [MaxLength(100)] public string? JobRole { get; set; } = string.Empty;
    public bool IsFavourite { get; set; }


    [MaxLength(200)] public string? UserAddress { get; set; } = string.Empty;

    [Phone] [MaxLength(20)] public string? UserPhoneNumber { get; set; }

    [Url] [MaxLength(50)] public string? LinkedinUrl { get; set; }

    [Url] [MaxLength(100)] public string? GithubUrl { get; set; }

    [Url] [MaxLength(100)] public string? PortfolioUrl { get; set; }
    public string? Tags { get; set; } = string.Empty;
    public string? Order { get; set; } = string.Empty;

    [Required] public string UserId { get; set; } = string.Empty;

    public virtual User? User { get; set; }
    public virtual List<ProjectEntity>? Projects { get; set; }
    public virtual List<EducationEntity>? Education { get; set; }
    public virtual List<WorkExperienceEntity>? WorkExperience { get; set; }
    public virtual List<SkillEntity>? Skills { get; set; }
}