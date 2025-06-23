using Resume_builder.Features.BulletPoint.Common;

namespace Resume_builder.Features.Education.Common;

public static class EducationExtensions
{
    public static EducationDto ToDto(this EducationEntity educationEntity)
    {
        return new EducationDto
        {
            ResumeId = educationEntity.ResumeId,
            UserId = educationEntity.UserId,
            SchoolName = educationEntity.SchoolName,
            Degree = educationEntity.Degree,
            FieldOfStudy = educationEntity.FieldOfStudy,
            Location = educationEntity.Location,
            IsOngoing = educationEntity.IsOngoing,
            StartDate = educationEntity.StartDate,
            EndDate = educationEntity.EndDate,
            Id = educationEntity.Id,
            CreatedAt = educationEntity.CreatedAt,
            UpdatedAt = educationEntity.UpdatedAt,
            ActiveStatus = educationEntity.ActiveStatus,
            BulletPoints = educationEntity.BulletPoints.Select(x => x.ToDto()).ToList()
        };
    }

    public static EducationEntity ToEntity(this EducationDto education)
    {
        return new EducationEntity
        {
            ResumeId = education.ResumeId,
            UserId = education.UserId,
            SchoolName = education.SchoolName,
            Degree = education.Degree,
            FieldOfStudy = education.FieldOfStudy,
            Location = education.Location,
            IsOngoing = education.IsOngoing,
            StartDate = education.StartDate,
            EndDate = education.EndDate,
            Id = education.Id,
            CreatedAt = education.CreatedAt,
            UpdatedAt = education.UpdatedAt,
            ActiveStatus = education.ActiveStatus,
            BulletPoints = education.BulletPoints.Select(x => x.ToEntity()).ToList()
        };
    }
}