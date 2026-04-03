using System.ComponentModel.DataAnnotations;
using Resume_builder.Common;
using Resume_builder.Features.Users;

namespace Resume_builder.Features.FileUpload;

public class FileUploadEntity : BaseEntity
{
    public string? ResumeId { get; set; }

    public string? CoverLetterId { get; set; }

    public int Version { get; set; }

    [Required]
    [MaxLength(2048)]
    public string Url { get; set; } = string.Empty;

    [Required]
    public string UserId { get; set; } = string.Empty;

    public virtual User? User { get; set; }
}
