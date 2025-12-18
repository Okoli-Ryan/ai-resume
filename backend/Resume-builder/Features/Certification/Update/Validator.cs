using FluentValidation;
using Resume_builder.Common;

namespace Resume_builder.Features.Certification.Update;

public class UpdateCertificationValidator : BaseValidator<UpdateCertificationRequest>
{
    public UpdateCertificationValidator()
    {
        RuleFor(x => x.CertificationName)
            .MaximumLength(200);

        RuleFor(x => x.CertificateLink)
            .MaximumLength(500);
    }
}
