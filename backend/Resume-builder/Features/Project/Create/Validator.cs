using FluentValidation;
using Resume_builder.Common;
using Resume_builder.Features.Project.Common;

namespace Resume_builder.Features.Project.Create;

public class CreateProjectValidator : BaseValidator<CreateProjectCommand>
{
    public CreateProjectValidator()
    {
        
        RuleFor(x => x.Name)
            .MaximumLength(100)
            .WithMessage("Name must be less than 100 characters long.");
        
        RuleFor(x => x.Link)
            .Must(uri => string.IsNullOrEmpty(uri) || Uri.TryCreate(uri, UriKind.Absolute, out _))
            .WithMessage("URL must be in valid format")
            .MaximumLength(256)
            .WithMessage("Url must be less than 256 characters long.");
    }
}