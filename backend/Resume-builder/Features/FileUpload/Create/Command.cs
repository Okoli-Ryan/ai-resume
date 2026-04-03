namespace Resume_builder.Features.FileUpload.Create;

public class CreateFileUploadCommand
{
    public string? ResumeId { get; set; }
    public string? CoverLetterId { get; set; }
    public int Version { get; set; }
    public string Url { get; set; } = string.Empty;
}
