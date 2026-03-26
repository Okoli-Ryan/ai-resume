using FluentValidation;
using Resume_builder.Common;

namespace Resume_builder.Features.Education.Update;

public class UpdateEducationValidator : BaseValidator<UpdateEducationRequest>
{
    public UpdateEducationValidator()
    {
    }
}