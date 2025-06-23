using FluentValidation;
using Resume_builder.Common;

namespace Resume_builder.Features.WorkExperience.Create;

public class CreateWorkExperienceValidator : BaseValidator<CreateWorkExperienceCommand>
{
    public CreateWorkExperienceValidator()
    {
        RuleFor(x => x.ResumeId)
            .NotEmpty();
        
        RuleFor(x => x.EndDate)
            .NotEmpty()
            .When(x => x.IsOngoing);
    }
}