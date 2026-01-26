using FluentValidation;
using Resume_builder.Common;

namespace Resume_builder.Features.BulletPoint.UpdateByFieldId;

public class UpdateBulletPointsByFieldIdValidator : BaseValidator<UpdateBulletPointsByFieldIdRequest>
{
    public UpdateBulletPointsByFieldIdValidator()
    {
        RuleForEach(x => x.BulletPoints)
            .Must(bp => !string.IsNullOrWhiteSpace(bp.Text))
            .WithMessage("Bullet point text cannot be empty");
    }
}