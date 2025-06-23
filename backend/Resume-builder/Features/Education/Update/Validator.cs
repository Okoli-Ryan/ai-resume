using FluentValidation;
using Resume_builder.Common;

namespace Resume_builder.Features.Education.Update;

public class UpdateEducationValidator : BaseValidator<UpdateEducationRequest>
{
    public UpdateEducationValidator()
    {
        RuleFor(x => x.EndDate)
            .NotEmpty()
            .When(x => x.IsOngoing);
    }
}