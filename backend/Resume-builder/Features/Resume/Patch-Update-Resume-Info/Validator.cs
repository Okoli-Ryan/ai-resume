using FluentValidation;
using Resume_builder.Common;

namespace Resume_builder.Features.Resume.PatchUpdateResumeInfo;

public class PatchUpdateResumeInfoValidator : BaseValidator<PatchUpdateResumeInfoRequest>
{
    public PatchUpdateResumeInfoValidator()
    {
        RuleFor(x => x.UserName)
            .MaximumLength(50)
            .When(x => x.UserName != null);

        RuleFor(x => x.ResumeName)
            .MaximumLength(100)
            .When(x => x.ResumeName != null);

        RuleFor(x => x.Email)
            .EmailAddress()
            .When(x => !string.IsNullOrEmpty(x.Email))
            .MaximumLength(100)
            .When(x => x.Email != null);

        RuleFor(x => x.Role)
            .MaximumLength(100)
            .When(x => x.Role != null);

        RuleFor(x => x.Address)
            .MaximumLength(200)
            .When(x => x.Address != null);

        RuleFor(x => x.PhoneNumber)
            .MaximumLength(20)
            .When(x => x.PhoneNumber != null);
    }
}
