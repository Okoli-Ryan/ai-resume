using FluentValidation;
using Resume_builder.Common;

namespace Resume_builder.Features.Education.Create;

public class CreateEducationValidator : BaseValidator<CreateEducationCommand>
{
    public CreateEducationValidator()
    {
        RuleFor(x => x.ResumeId)
            .NotEmpty();
        
        RuleFor(x => x.EndDate)
            .NotEmpty()
            .When(x => x.IsOngoing);
    }
}