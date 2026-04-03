namespace Resume_builder.Features.FileUpload.UploadFile;

public class UploadFileCommand
{
    public IFormFile File { get; set; } = null!;
    public string? ResumeId { get; set; }
    public string? CoverLetterId { get; set; }
}
