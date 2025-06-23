using FluentValidation;
using Resume_builder.Common;

namespace Resume_builder.Features.Resume.Update;

public class UpdateResumeValidator : BaseValidator<UpdateResumeRequest>
{
    public UpdateResumeValidator()
    {
        RuleFor(x => x.UserName)
            .MaximumLength(50);

        RuleFor(x => x.Email)
            .EmailAddress()
            .When(x => !string.IsNullOrEmpty(x.Email))
            .MaximumLength(100);

        RuleFor(x => x.Summary)
            .MaximumLength(1500);

        RuleFor(x => x.Role)
            .MaximumLength(100);

        RuleFor(x => x.Address)
            .MaximumLength(200);

        RuleFor(x => x.PhoneNumber)
            .MaximumLength(20);

        RuleFor(x => x.LinkedinUrl)
            .Must(uri => string.IsNullOrEmpty(uri) || Uri.TryCreate(uri, UriKind.Absolute, out _))
            .WithMessage("LinkedIn URL must be in valid format")
            .MaximumLength(200);

        RuleFor(x => x.GithubUrl)
            .Must(uri => string.IsNullOrEmpty(uri) || Uri.TryCreate(uri, UriKind.Absolute, out _))
            .WithMessage("GitHub URL must be in valid format")
            .MaximumLength(200);

        RuleFor(x => x.PortfolioUrl)
            .Must(uri => string.IsNullOrEmpty(uri) || Uri.TryCreate(uri, UriKind.Absolute, out _))
            .WithMessage("Portfolio URL must be in valid format")
            .MaximumLength(200);
    }
}