using FluentValidation;
using Resume_builder.Common;

namespace Resume_builder.Features.Resume.PatchUpdateLinks;

public class PatchUpdateLinksValidator : BaseValidator<PatchUpdateLinksRequest>
{
    public PatchUpdateLinksValidator()
    {
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
