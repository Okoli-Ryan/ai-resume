using FluentValidation;
using Resume_builder.Common;

namespace Resume_builder.Features.Link.Create;

public class CreateLinkValidator : BaseValidator<CreateLinkCommand>
{
    public CreateLinkValidator()
    {
        RuleFor(x => x.ResumeId)
            .NotEmpty();
        
        RuleFor(x => x.LinkName)
            .NotEmpty();
        
        RuleFor(x => x.Url)
            .NotEmpty();
    }
}
