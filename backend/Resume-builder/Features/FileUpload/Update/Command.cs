namespace Resume_builder.Features.FileUpload.Update;

public record UpdateFileUploadCommand(string FileUploadId, UpdateFileUploadRequest Request);

public class UpdateFileUploadRequest
{
    public string? ResumeId { get; set; }
    public string? CoverLetterId { get; set; }
    public int Version { get; set; }
    public string Url { get; set; } = string.Empty;
}
