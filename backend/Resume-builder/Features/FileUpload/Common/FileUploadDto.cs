using Resume_builder.Common;

namespace Resume_builder.Features.FileUpload.Common;

public class FileUploadDto : BaseEntity
{
    public string? ResumeId { get; set; }
    public string? CoverLetterId { get; set; }
    public int Version { get; set; }
    public string Url { get; set; } = string.Empty;
    public string ShortenedUrl { get; set; } = string.Empty;
    public string FileKey { get; set; } = string.Empty;
    public required string UserId { get; set; }
}