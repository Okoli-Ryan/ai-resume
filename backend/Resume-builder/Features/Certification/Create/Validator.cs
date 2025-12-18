using FluentValidation;
using Resume_builder.Common;

namespace Resume_builder.Features.Certification.Create;

public class CreateCertificationValidator : BaseValidator<CreateCertificationCommand>
{
    public CreateCertificationValidator()
    {
        RuleFor(x => x.CertificationName)
            .MaximumLength(200);

        RuleFor(x => x.CertificateLink)
            .MaximumLength(500);

        RuleFor(x => x.ResumeId)
            .NotEmpty();
    }
}
