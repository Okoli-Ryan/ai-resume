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
            .Must(BeAValidUrl)
            .WithMessage("URL must be in valid format")
            .MaximumLength(256)
            .WithMessage("Url must be less than 256 characters long.");
    }

    private static bool BeAValidUrl(string? url)
    {
        if (string.IsNullOrEmpty(url))
            return true;

        if (Uri.TryCreate(url, UriKind.Absolute, out _))
            return true;

        return Uri.TryCreate("https://" + url, UriKind.Absolute, out _);
    }
}