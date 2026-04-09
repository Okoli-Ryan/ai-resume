using Resume_builder.Features.BulletPoint;
using Resume_builder.Features.Certification;
using Resume_builder.Features.Education;
using Resume_builder.Features.Project;
using Resume_builder.Features.Skills;
using Resume_builder.Features.WorkExperience;
using Resume_builder.Infrastructure.Services.AIChatClient.Common;
using Resume_builder.Utils;

namespace Resume_builder.Features.Resume.Common;

public static class ParsedResumeMapper
{
    public static ResumeEntity ToResumeEntity(this ParsedResumeResponse resume, string userId)
    {
        return new ResumeEntity
        {
            ResumeName = RandomStringGenerator.Generate(16),
            UserFullName = resume.UserFullName,
            UserEmail = resume.UserEmail,
            TextSummary = resume.TextSummary,
            JobRole = resume.JobRole,
            UserAddress = resume.UserAddress,
            IsFavourite = false,
            UserPhoneNumber = resume.UserPhoneNumber,
            LinkedinUrl = resume.LinkedinUrl,
            GithubUrl = resume.GithubUrl,
            PortfolioUrl = resume.PortfolioUrl,
            Tags = string.Join(",", resume.Tags),
            UserId = userId
        };
    }

    public static void MapChildEntities(this ResumeEntity newResume, ParsedResumeResponse resume, string userId)
    {
        newResume.Education = resume.Education?.Select(x =>
        {
            return new EducationEntity
            {
                SchoolName = x.SchoolName,
                Degree = x.Degree,
                FieldOfStudy = x.FieldOfStudy,
                Location = x.Location,
                StartDate = DateTimeOffset.TryParse(x.StartDate, out var eduStart) ? eduStart.UtcDateTime : null,
                EndDate = DateTimeOffset.TryParse(x.EndDate, out var eduEnd) ? eduEnd.UtcDateTime : null,
                ResumeId = newResume.Id,
                UserId = userId
            };
        }).ToList();

        newResume.WorkExperience = resume.WorkExperience?.Select(x =>
        {
            return new WorkExperienceEntity
            {
                ResumeId = newResume.Id,
                UserId = userId,
                CompanyName = x.CompanyName,
                CompanyLink = x.CompanyLink,
                Title = x.Title,
                StartDate = DateTimeOffset.TryParse(x.StartDate, out var workStart) ? workStart.UtcDateTime : null,
                EndDate = DateTimeOffset.TryParse(x.EndDate, out var workEnd) ? workEnd.UtcDateTime : null,
                Location = x.Location,
                WorkType = x.WorkType
            };
        }).ToList();

        newResume.Projects = resume.Projects.Select(x =>
        {
            return new ProjectEntity
            {
                ProjectName = x.ProjectName,
                ProjectUrl = x.ProjectUrl,
                ResumeId = newResume.Id,
                UserId = userId
            };
        }).ToList();

        newResume.Skills = resume.Skills?.Select(x =>
        {
            return new SkillEntity
            {
                Group = x.Category,
                Skills = string.Join(",", x.Skills),
                ResumeId = newResume.Id,
                UserId = userId
            };
        }).ToList();

        newResume.Certifications = resume.Certifications?.Select(x =>
        {
            return new CertificationEntity
            {
                CertificationName = x.CertificationName,
                CertificateLink = x.CertificateLink,
                DateAttained = x.DateAttained,
                ResumeId = newResume.Id,
                UserId = userId
            };
        }).ToList();
    }

    public static void AddBulletPoints(this ResumeEntity newResume, ParsedResumeResponse resume)
    {
        foreach (var (work, index) in (resume.WorkExperience ?? []).Select((value, i) => (value, i)))
        foreach (var bulletPoint in work.BulletPoints)
        {
            var workExperienceList = newResume.WorkExperience ?? [];
            workExperienceList[index].BulletPoints.Add(new BulletPointEntity
            {
                Text = bulletPoint,
                Order = index,
                WorkExperienceId = workExperienceList[index].Id,
                ResumeId = newResume.Id
            });
        }

        foreach (var (certification, index) in (resume.Certifications ?? []).Select((value, i) => (value, i)))
        foreach (var bulletPoint in certification.BulletPoints)
        {
            var certificationList = newResume.Certifications ?? [];
            certificationList[index].BulletPoints.Add(new BulletPointEntity
            {
                Text = bulletPoint,
                Order = index,
                WorkExperienceId = certificationList[index].Id,
                ResumeId = newResume.Id
            });
        }

        foreach (var (education, index) in (resume.Education ?? []).Select((value, i) => (value, i)))
        foreach (var bulletPoint in education.BulletPoints)
        {
            var educationList = newResume.Education ?? [];
            educationList[index].BulletPoints.Add(new BulletPointEntity
            {
                Text = bulletPoint,
                Order = index,
                EducationId = educationList[index].Id,
                ResumeId = newResume.Id
            });
        }

        foreach (var (project, index) in (resume.Projects ?? []).Select((value, i) => (value, i)))
        foreach (var bulletPoint in project.BulletPoints)
        {
            var projectList = newResume.Projects ?? [];
            projectList[index].BulletPoints.Add(new BulletPointEntity
            {
                Text = bulletPoint,
                Order = index,
                ProjectId = projectList[index].Id,
                ResumeId = newResume.Id
            });
        }
    }
}
