using FluentValidation;
using Resume_builder.Common;

namespace Resume_builder.Features.Education.PatchUpdate;

public class PatchUpdateEducationValidator : BaseValidator<PatchUpdateEducationRequest>
{
    public PatchUpdateEducationValidator()
    {
        RuleFor(x => x.SchoolName)
            .MaximumLength(100)
            .When(x => x.SchoolName != null);

        RuleFor(x => x.Degree)
            .MaximumLength(100)
            .When(x => x.Degree != null);

        RuleFor(x => x.FieldOfStudy)
            .MaximumLength(100)
            .When(x => x.FieldOfStudy != null);

        RuleFor(x => x.Location)
            .MaximumLength(100)
            .When(x => x.Location != null);

        RuleFor(x => x.StartDate)
            .LessThanOrEqualTo(x => x.EndDate)
            .When(x => x.StartDate != null && x.EndDate != null)
            .WithMessage("Start date must be before or equal to end date");
        
    }
}