using FluentValidation;
using Resume_builder.Common;

namespace Resume_builder.Features.Link.Update;

public class UpdateLinkValidator : BaseValidator<UpdateLinkRequest>
{
    public UpdateLinkValidator()
    {
        RuleFor(x => x.LinkName)
            .NotEmpty();
        
        RuleFor(x => x.Url)
            .NotEmpty();
    }
}
