using FluentValidation;
using Resume_builder.Common;

namespace Resume_builder.Features.FileUpload.UploadFile;

public class UploadFileValidator : BaseValidator<UploadFileCommand>
{
    private static readonly string[] AllowedContentTypes =
    [
        "application/pdf",
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp"
    ];

    private const long MaxFileSizeBytes = 16 * 1024 * 1024; // 16 MB

    public UploadFileValidator()
    {
        RuleFor(x => x.File)
            .NotNull()
            .WithMessage("A file is required.");

        When(x => x.File != null, () =>
        {
            RuleFor(x => x.File.Length)
                .GreaterThan(0)
                .WithMessage("File must not be empty.")
                .LessThanOrEqualTo(MaxFileSizeBytes)
                .WithMessage($"File size must not exceed {MaxFileSizeBytes / (1024 * 1024)} MB.");

            RuleFor(x => x.File.ContentType)
                .Must(ct => AllowedContentTypes.Contains(ct))
                .WithMessage($"Allowed file types: {string.Join(", ", AllowedContentTypes)}.");
        });
    }
}
