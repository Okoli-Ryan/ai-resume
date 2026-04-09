using FluentValidation;
using Resume_builder.Common;

namespace Resume_builder.Features.Certification.PatchUpdate;

public class PatchUpdateCertificationValidator : BaseValidator<PatchUpdateCertificationRequest>
{
    public PatchUpdateCertificationValidator()
    {
        RuleFor(x => x.CertificationName)
            .MaximumLength(200)
            .When(x => x.CertificationName != null);

        RuleFor(x => x.CertificateLink)
            .MaximumLength(500)
            .When(x => x.CertificateLink != null);

        RuleFor(x => x.CertificateLink)
            .Must(BeAValidUrl)
            .When(x => !string.IsNullOrEmpty(x.CertificateLink))
            .WithMessage("Certificate link must be a valid URL");

        RuleFor(x => x.DateAttained)
            .LessThanOrEqualTo(DateTime.UtcNow)
            .When(x => x.DateAttained != null)
            .WithMessage("Date attained cannot be in the future");
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
