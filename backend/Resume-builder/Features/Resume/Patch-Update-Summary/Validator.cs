using FluentValidation;
using Resume_builder.Common;

namespace Resume_builder.Features.Resume.Patch_Update_Summary;

public class PatchUpdateSummaryValidator : BaseValidator<PatchUpdateSummaryRequest>
{
    public PatchUpdateSummaryValidator()
    {
        RuleFor(x => x.Summary)
            .MaximumLength(1500)
            .When(x => x.Summary != null);
    }
}
