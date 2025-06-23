using Resume_builder.Features.BulletPoint.Common;

namespace Resume_builder.Features.Project.Common;

public static class ProjectExtensions
{
    public static ProjectDto ToDto(this ProjectEntity project)
    {
        return new ProjectDto
        {
            Id = project.Id,
            ActiveStatus = project.ActiveStatus,
            CreatedAt = project.CreatedAt,
            UpdatedAt = project.UpdatedAt,
            Name = project.ProjectName,
            Link = project.ProjectUrl,
            ResumeId = project.ResumeId,
            UserId = project.UserId,
            // Resume = project.Resume?.ToDto(),
            User = project.User,
            BulletPoints = project.BulletPoints.Select(x => x.ToDto()).ToList()
        };
    }

    public static ProjectEntity ToEntity(this ProjectDto project)
    {
        return new ProjectEntity
        {
            Id = project.Id,
            ActiveStatus = project.ActiveStatus,
            CreatedAt = project.CreatedAt,
            UpdatedAt = project.UpdatedAt,
            ProjectName = project.Name,
            ProjectUrl = project.Link,
            UserId = project.UserId,
            BulletPoints = (project.BulletPoints ?? []).Select(x => x.ToEntity()).ToList()
        };
    }
}