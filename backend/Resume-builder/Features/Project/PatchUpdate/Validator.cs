using FluentValidation;
using Resume_builder.Common;

namespace Resume_builder.Features.Project.PatchUpdate;

public class PatchUpdateProjectValidator : BaseValidator<PatchUpdateProjectRequest>
{
    public PatchUpdateProjectValidator()
    {
        RuleFor(x => x.ProjectName)
            .MaximumLength(100)
            .When(x => x.ProjectName != null);

        RuleFor(x => x.ProjectUrl)
            .MaximumLength(256)
            .When(x => x.ProjectUrl != null);

        RuleFor(x => x.ProjectUrl)
            .Must(BeAValidUrl)
            .When(x => !string.IsNullOrEmpty(x.ProjectUrl))
            .WithMessage("Project URL must be a valid URL");
    }

    private static bool BeAValidUrl(string? url)
    {
        if (string.IsNullOrEmpty(url))
            return true;
        
        return Uri.TryCreate(url, UriKind.Absolute, out var result) &&
               (result.Scheme == Uri.UriSchemeHttp || result.Scheme == Uri.UriSchemeHttps);
    }
}
