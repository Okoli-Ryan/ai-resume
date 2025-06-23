using FluentValidation;
using Resume_builder.Common;

namespace Resume_builder.Features.BulletPoint.Create;

public class CreateBulletPointValidator : BaseValidator<List<CreateBulletPointsCommand>>
{
    public CreateBulletPointValidator()
    {
        RuleForEach(x => x)
            .ChildRules(bullet =>
            {
                bullet.RuleFor<string>(x => x.Text)
                    .MaximumLength(512)
                    .WithMessage("Bullet point text cannot exceed 512 characters");
            });
    }
}