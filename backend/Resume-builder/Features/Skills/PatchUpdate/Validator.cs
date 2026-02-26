using FluentValidation;
using Resume_builder.Common;

namespace Resume_builder.Features.Skills.PatchUpdate;

public class PatchUpdateSkillValidator : BaseValidator<PatchUpdateSkillRequest>
{
    public PatchUpdateSkillValidator()
    {
        RuleFor(x => x.Category)
            .MaximumLength(100)
            .When(x => x.Category != null);

        RuleFor(x => x.Skills)
            .MaximumLength(500)
            .When(x => x.Skills != null);
    }
}
