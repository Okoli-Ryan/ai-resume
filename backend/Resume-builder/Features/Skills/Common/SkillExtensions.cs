namespace Resume_builder.Features.Skills.Common;

public static class SkillExtensions
{
    public static SkillDto ToDto(this SkillEntity skill)
    {
        return new SkillDto
        {
            Id = skill.Id,
            Category = skill.Group,
            Skills = skill.Skills,
            ResumeId = skill.ResumeId,
            UserId = skill.UserId,
            ActiveStatus = skill.ActiveStatus,
            CreatedAt = skill.CreatedAt,
            UpdatedAt = skill.UpdatedAt,
        };
    }

    public static SkillEntity ToEntity(this SkillDto skill)
    {
        return new SkillEntity
        {
            Id = skill.Id,
            Group = skill.Category,
            Skills = skill.Skills,
            ResumeId = skill.ResumeId,
            UserId = skill.UserId,
            ActiveStatus = skill.ActiveStatus,
            CreatedAt = skill.CreatedAt,
            UpdatedAt = skill.UpdatedAt,
        };
    }
}