using FluentValidation;
using Resume_builder.Common;

namespace Resume_builder.Features.WorkExperience.Update;

public class UpdateWorkExperienceValidator : BaseValidator<UpdateWorkExperienceRequest>
{
    public UpdateWorkExperienceValidator()
    {
        RuleFor(x => x.EndDate)
            .NotEmpty()
            .When(x => x.IsOngoing);
    }
}