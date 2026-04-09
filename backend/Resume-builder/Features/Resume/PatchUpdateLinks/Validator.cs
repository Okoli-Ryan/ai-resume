using FluentValidation;
using Resume_builder.Common;

namespace Resume_builder.Features.Resume.PatchUpdateLinks;

public class PatchUpdateLinksValidator : BaseValidator<PatchUpdateLinksRequest>
{
    public PatchUpdateLinksValidator()
    {
        RuleFor(x => x.LinkedinUrl)
            .Must(BeAValidUrl)
            .WithMessage("LinkedIn URL must be in valid format")
            .MaximumLength(200)
            .When(x => x.LinkedinUrl != null);

        RuleFor(x => x.GithubUrl)
            .Must(BeAValidUrl)
            .WithMessage("GitHub URL must be in valid format")
            .MaximumLength(200)
            .When(x => x.GithubUrl != null);

        RuleFor(x => x.PortfolioUrl)
            .Must(BeAValidUrl)
            .WithMessage("Portfolio URL must be in valid format")
            .MaximumLength(200)
            .When(x => x.PortfolioUrl != null);
    }

    private static bool BeAValidUrl(string? url)
    {
        if (string.IsNullOrEmpty(url))
            return true;

        if (Uri.TryCreate(url, UriKind.Absolute, out _))
            return true;

        return Uri.TryCreate("https://" + url, UriKind.Absolute, out _);
    }
}
