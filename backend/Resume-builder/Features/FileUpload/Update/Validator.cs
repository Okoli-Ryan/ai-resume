using FluentValidation;
using Resume_builder.Common;

namespace Resume_builder.Features.FileUpload.Update;

public class UpdateFileUploadValidator : BaseValidator<UpdateFileUploadRequest>
{
    public UpdateFileUploadValidator()
    {
        RuleFor(x => x.Url)
            .NotEmpty()
            .MaximumLength(2048);

        RuleFor(x => x.Version)
            .GreaterThanOrEqualTo(0);
    }
}
