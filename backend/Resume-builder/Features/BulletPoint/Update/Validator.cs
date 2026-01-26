using FluentValidation;
using Resume_builder.Common;

namespace Resume_builder.Features.BulletPoint.Update;

public class UpdateBulletPointValidator : BaseValidator<UpdateBulletPointRequest>
{
    public UpdateBulletPointValidator()
    {
        RuleFor(x => x.Text)
            .NotEmpty()
            .WithMessage("Bullet point text cannot be empty");
    }
}