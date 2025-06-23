namespace Resume_builder.Features.BulletPoint.Common;

public static class BulletPointExtensions
{
    public static BulletPointDto ToDto(this BulletPointEntity bulletPoint)
    {
        return new BulletPointDto
        {
            Id = bulletPoint.Id,
            CreatedAt = bulletPoint.CreatedAt,
            UpdatedAt = bulletPoint.UpdatedAt,
            ActiveStatus = bulletPoint.ActiveStatus,
            Text = bulletPoint.Text,
            ProjectId = bulletPoint.ProjectId,
            EducationId = bulletPoint.EducationId,
            WorkExperienceId = bulletPoint.WorkExperienceId
        };
    }

    public static BulletPointEntity ToEntity(this BulletPointDto bulletPoint)
    {
        return new BulletPointEntity
        {
            Id = bulletPoint.Id,
            CreatedAt = bulletPoint.CreatedAt,
            UpdatedAt = bulletPoint.UpdatedAt,
            ActiveStatus = bulletPoint.ActiveStatus,
            Text = bulletPoint.Text,
            Order = bulletPoint.Order,
            EducationId = bulletPoint.EducationId,
            ProjectId = bulletPoint.ProjectId,
            WorkExperienceId = bulletPoint.WorkExperienceId
        };
    }
}