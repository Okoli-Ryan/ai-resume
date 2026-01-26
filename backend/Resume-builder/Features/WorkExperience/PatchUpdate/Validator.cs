using FluentValidation;
using Resume_builder.Common;

namespace Resume_builder.Features.WorkExperience.PatchUpdate;

public class PatchUpdateWorkExperienceValidator : BaseValidator<PatchUpdateWorkExperienceRequest>
{
    public PatchUpdateWorkExperienceValidator()
    {
        RuleFor(x => x.CompanyName)
            .MaximumLength(128)
            .When(x => x.CompanyName != null);

        RuleFor(x => x.CompanyLink)
            .MaximumLength(128)
            .When(x => x.CompanyLink != null);

        RuleFor(x => x.Title)
            .MaximumLength(128)
            .When(x => x.Title != null);

        RuleFor(x => x.WorkType)
            .MaximumLength(32)
            .When(x => x.WorkType != null);

        RuleFor(x => x.Location)
            .MaximumLength(128)
            .When(x => x.Location != null);

        RuleFor(x => x.StartDate)
            .LessThanOrEqualTo(x => x.EndDate)
            .When(x => x.StartDate != null && x.EndDate != null && x.IsOngoing != true)
            .WithMessage("Start date must be before or equal to end date");

        RuleFor(x => x.EndDate)
            .Null()
            .When(x => x.IsOngoing == true)
            .WithMessage("End date should not be provided when position is ongoing");
    }
}
