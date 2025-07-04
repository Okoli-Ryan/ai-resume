using Resume_builder.Features.BulletPoint;
using Resume_builder.Features.Education;
using Resume_builder.Features.Education.Common;
using Resume_builder.Features.Project;
using Resume_builder.Features.Project.Common;
using Resume_builder.Features.Resume.Create;
using Resume_builder.Features.Skills;
using Resume_builder.Features.Skills.Common;
using Resume_builder.Features.WorkExperience;
using Resume_builder.Features.WorkExperience.Common;
using Resume_builder.Utils;

namespace Resume_builder.Features.Resume.Common;

public static class ResumeExtensions
{
    public static ResumeDto ToDto(this ResumeEntity resumeEntity)
    {
        return new ResumeDto
        {
            UserName = resumeEntity.UserFullName,
            ResumeName = resumeEntity.ResumeName,
            Email = resumeEntity.UserEmail,
            UserId = resumeEntity.UserId,
            Summary = resumeEntity.TextSummary,
            Role = resumeEntity.JobRole,
            Address = resumeEntity.UserAddress,
            PhoneNumber = resumeEntity.UserPhoneNumber,
            LinkedinUrl = resumeEntity.LinkedinUrl,
            GithubUrl = resumeEntity.GithubUrl,
            IsFavourite = resumeEntity.IsFavourite,
            PortfolioUrl = resumeEntity.PortfolioUrl,
            Order = resumeEntity.Order,
            Tags = resumeEntity.Tags,
            Id = resumeEntity.Id,
            ActiveStatus = resumeEntity.ActiveStatus,
            CreatedAt = resumeEntity.CreatedAt,
            UpdatedAt = resumeEntity.UpdatedAt,
            WorkExperience = resumeEntity.WorkExperience?.Select(x => x.ToDto()).ToList(),
            Projects = resumeEntity.Projects?.Select(x => x.ToDto()).ToList(),
            Education = resumeEntity.Education?.Select(x => x.ToDto()).ToList(),
            Skills = resumeEntity.Skills?.Select(x => x.ToDto()).ToList()
        };
    }

    public static List<ResumeDto> ToDto(this List<ResumeEntity> resumes)
    {
        return resumes.Select(x => x.ToDto()).ToList();
    }

    public static ResumeEntity ToEntity(this ResumeDto resume)
    {
        return new ResumeEntity
        {
            UserFullName = resume.UserName,
            UserId = resume.UserId,
            ResumeName = resume.ResumeName,
            UserEmail = resume.Email,
            TextSummary = resume.Summary,
            JobRole = resume.Role,
            UserAddress = resume.Address,
            Tags = resume.Tags,
            UserPhoneNumber = resume.PhoneNumber,
            IsFavourite = resume.IsFavourite,
            LinkedinUrl = resume.LinkedinUrl,
            GithubUrl = resume.GithubUrl,
            Order = resume.Order,
            PortfolioUrl = resume.PortfolioUrl,
            Id = resume.Id,
            ActiveStatus = resume.ActiveStatus,
            CreatedAt = resume.CreatedAt,
            UpdatedAt = resume.UpdatedAt,
            WorkExperience = resume.WorkExperience?.Select(x => x.ToEntity()).ToList(),
            Projects = resume.Projects?.Select(x => x.ToEntity()).ToList(),
            Education = resume.Education?.Select(x => x.ToEntity()).ToList()
        };
    }


    public static ResumeEntity CreateResumeEntity(CreateResumeCommand request, string userId)
    {
        var resume = new ResumeEntity
        {
            ResumeName = string.IsNullOrEmpty(request.ResumeName)
                ? RandomStringGenerator.Generate(16)
                : request.ResumeName,
            UserFullName = request.UserName,
            UserEmail = request.Email,
            TextSummary = request.Summary,
            JobRole = request.Role,
            IsFavourite = false,
            UserAddress = request.Address,
            UserPhoneNumber = request.PhoneNumber,
            LinkedinUrl = request.LinkedinUrl,
            GithubUrl = request.GithubUrl,
            Order = request.Order,
            Tags = request.Tags,
            PortfolioUrl = request.PortfolioUrl,
            UserId = userId
        };
        return resume;
    }


    public static void CreateSkillEntity(CreateResumeCommand request, ResumeEntity resume, string userId)
    {
        resume.Skills = request.Skills?.Select(x =>
        {
            var skill = new SkillEntity
            {
                Group = x.Group,
                Skills = x.Skills,
                ResumeId = resume.Id,
                UserId = userId
            };
            return skill;
        }).ToList();
    }

    public static void CreateProjectEntity(CreateResumeCommand request, ResumeEntity resume, string userId)
    {
        resume.Projects = request.Projects?.Select(x =>
        {
            var project = new ProjectEntity
            {
                ProjectName = x.Name,
                ProjectUrl = x.Link,
                ResumeId = resume.Id,
                UserId = userId
            };

            return project;
        }).ToList();
    }

    public static void CreateEducationEntity(CreateResumeCommand request, ResumeEntity resume, string userId)
    {
        resume.Education = request.Education?.Select(x =>
        {
            var education = new EducationEntity
            {
                SchoolName = x.SchoolName,
                Degree = x.Degree,
                FieldOfStudy = x.FieldOfStudy,
                Location = x.Location,
                IsOngoing = x.IsOngoing,
                StartDate = x.StartDate,
                EndDate = x.EndDate,
                ResumeId = resume.Id,
                UserId = userId
            };

            return education;
        }).ToList();
    }

    public static void CreateWorkExperienceEntity(CreateResumeCommand request, ResumeEntity resume, string userId)
    {
        resume.WorkExperience = request.WorkExperience?.Select(x =>
        {
            var workExperience = new WorkExperienceEntity
            {
                ResumeId = resume.Id,
                UserId = userId,
                CompanyName = x.CompanyName,
                CompanyLink = x.CompanyLink,
                Title = x.Title,
                StartDate = x.StartDate,
                EndDate = x.EndDate,
                IsOngoing = x.IsOngoing,
                Location = x.Location,
                WorkType = x.WorkType
            };
            return workExperience;
        }).ToList();
    }

    public static void AssignWorkExperienceIdToBulletPoints(CreateResumeCommand request, ResumeEntity resume)
    {
        foreach (var (work, index) in (request.WorkExperience ?? []).Select((value, i) => (value, i)))
        foreach (var bullet in work.BulletPoints)
        {
            var workExperienceList = resume.WorkExperience ?? [];

            workExperienceList[index].BulletPoints.Add(new BulletPointEntity
            {
                Text = bullet.Text,
                Order = bullet.Order,
                WorkExperienceId = workExperienceList[index].Id
            });
        }
    }


    public static void AssignEducationIdToBulletPoints(CreateResumeCommand request, ResumeEntity resume)
    {
        foreach (var (education, index) in (request.Education ?? []).Select((value, i) => (value, i)))
        foreach (var bullet in education.BulletPoints)
        {
            var educationList = resume.Education ?? [];

            educationList[index].BulletPoints.Add(new BulletPointEntity
            {
                Text = bullet.Text,
                Order = bullet.Order,
                EducationId = educationList[index].Id
            });
        }
    }

    public static void AssignProjectIdToBulletPoints(CreateResumeCommand request, ResumeEntity resume)
    {
        foreach (var (project, index) in (request.Projects ?? []).Select((value, i) => (value, i)))
        foreach (var bullet in project.BulletPoints)
        {
            var projectList = resume.Projects ?? [];

            projectList[index].BulletPoints.Add(new BulletPointEntity
            {
                Text = bullet.Text,
                Order = bullet.Order,
                ProjectId = projectList[index].Id
            });
        }
    }
}