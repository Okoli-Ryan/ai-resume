using FluentValidation;
using Resume_builder.Common;

namespace Resume_builder.Features.FileUpload.Create;

public class CreateFileUploadValidator : BaseValidator<CreateFileUploadCommand>
{
    public CreateFileUploadValidator()
    {
        RuleFor(x => x.Url)
            .NotEmpty()
            .MaximumLength(2048);

        RuleFor(x => x.Version)
            .GreaterThanOrEqualTo(0);
    }
}
