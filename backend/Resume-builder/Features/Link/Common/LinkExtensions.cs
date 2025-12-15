namespace Resume_builder.Features.Link.Common;

public static class LinkExtensions
{
    public static LinkDto ToDto(this LinkEntity linkEntity)
    {
        return new LinkDto
        {
            Url = linkEntity.Url,
            Name = linkEntity.LinkName,
            Index = linkEntity.Index,
            ResumeId = linkEntity.ResumeId,
            UserId = linkEntity.UserId,
            Id = linkEntity.Id,
            ActiveStatus = linkEntity.ActiveStatus,
            CreatedAt = linkEntity.CreatedAt,
            UpdatedAt = linkEntity.UpdatedAt
        };
    }

    public static LinkEntity ToEntity(this LinkDto linkDto)
    {
        return new LinkEntity
        {
            Url = linkDto.Url,
            LinkName = linkDto.Name,
            Index = linkDto.Index,
            Id = linkDto.Id,
            ResumeId = linkDto.ResumeId,
            UserId = linkDto.UserId,
            ActiveStatus = linkDto.ActiveStatus,
            CreatedAt = linkDto.CreatedAt,
            UpdatedAt = linkDto.UpdatedAt
        };
    }
}