namespace Resume_builder.Features.FileUpload.Common;

public static class FileUploadExtensions
{
    public static FileUploadDto ToDto(this FileUploadEntity entity)
    {
        return new FileUploadDto
        {
            Id = entity.Id,
            ActiveStatus = entity.ActiveStatus,
            CreatedAt = entity.CreatedAt,
            UpdatedAt = entity.UpdatedAt,
            ResumeId = entity.ResumeId,
            CoverLetterId = entity.CoverLetterId,
            Version = entity.Version,
            Url = entity.Url,
            UserId = entity.UserId
        };
    }
}
