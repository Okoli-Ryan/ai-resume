using Resume_builder.Features.BulletPoint.Common;

namespace Resume_builder.Features.WorkExperience.Common;

public static class WorkExperienceExtensions
{
    public static WorkExperienceDto ToDto(this WorkExperienceEntity workExperience)
    {
        return new WorkExperienceDto
        {
            ResumeId = workExperience.ResumeId,
            CompanyName = workExperience.CompanyName,
            CompanyLink = workExperience.CompanyLink,
            Title = workExperience.Title,
            StartDate = workExperience.StartDate,
            EndDate = workExperience.EndDate,
            IsOngoing = workExperience.IsOngoing,
            Location = workExperience.Location,
            UserId = workExperience.UserId,
            Id = workExperience.Id,
            CreatedAt = workExperience.CreatedAt,
            UpdatedAt = workExperience.UpdatedAt,
            ActiveStatus = workExperience.ActiveStatus,
            WorkType = workExperience.WorkType,
            BulletPoints = workExperience.BulletPoints.Select(x => x.ToDto()).ToList(),
        };
    }

    public static WorkExperienceEntity ToEntity(this WorkExperienceDto workExperience)
    {
        return new WorkExperienceEntity
        {
            ResumeId = workExperience.ResumeId,
            CompanyName = workExperience.CompanyName,
            CompanyLink = workExperience.CompanyLink,
            Title = workExperience.Title,
            StartDate = workExperience.StartDate,
            EndDate = workExperience.EndDate,
            IsOngoing = workExperience.IsOngoing,
            Location = workExperience.Location,
            Id = workExperience.Id,
            CreatedAt = workExperience.CreatedAt,
            UserId = workExperience.UserId,
            UpdatedAt = workExperience.UpdatedAt,
            ActiveStatus = workExperience.ActiveStatus,
            BulletPoints = workExperience.BulletPoints?.Select(x => x.ToEntity()).ToList()
        };
    }
}