using FluentValidation;
using Resume_builder.Common;

namespace Resume_builder.Features.Resume.PatchUpdate;

public class PatchUpdateResumeValidator : BaseValidator<PatchUpdateResumeRequest>
{
    public PatchUpdateResumeValidator()
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

        RuleFor(x => x.Summary)
            .MaximumLength(1500)
            .When(x => x.Summary != null);

        RuleFor(x => x.Role)
            .MaximumLength(100)
            .When(x => x.Role != null);

        RuleFor(x => x.Address)
            .MaximumLength(200)
            .When(x => x.Address != null);

        RuleFor(x => x.PhoneNumber)
            .MaximumLength(20)
            .When(x => x.PhoneNumber != null);

        RuleFor(x => x.LinkedinUrl)
            .Must(uri => string.IsNullOrEmpty(uri) || Uri.TryCreate(uri, UriKind.Absolute, out _))
            .WithMessage("LinkedIn URL must be in valid format")
            .MaximumLength(200)
            .When(x => x.LinkedinUrl != null);

        RuleFor(x => x.GithubUrl)
            .Must(uri => string.IsNullOrEmpty(uri) || Uri.TryCreate(uri, UriKind.Absolute, out _))
            .WithMessage("GitHub URL must be in valid format")
            .MaximumLength(200)
            .When(x => x.GithubUrl != null);

        RuleFor(x => x.PortfolioUrl)
            .Must(uri => string.IsNullOrEmpty(uri) || Uri.TryCreate(uri, UriKind.Absolute, out _))
            .WithMessage("Portfolio URL must be in valid format")
            .MaximumLength(200)
            .When(x => x.PortfolioUrl != null);
    }
}
