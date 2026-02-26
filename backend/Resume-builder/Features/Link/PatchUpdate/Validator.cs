using FluentValidation;
using Resume_builder.Common;

namespace Resume_builder.Features.Link.PatchUpdate;

public class PatchUpdateLinkValidator : BaseValidator<PatchUpdateLinkRequest>
{
    public PatchUpdateLinkValidator()
    {
        RuleFor(x => x.Name)
            .MaximumLength(100)
            .When(x => x.Name != null);

        RuleFor(x => x.Url)
            .MaximumLength(500)
            .When(x => x.Url != null);

        RuleFor(x => x.Index)
            .GreaterThanOrEqualTo(0)
            .When(x => x.Index != null);
    }
}
