using FluentValidation;
using Resume_builder.Common;

namespace Resume_builder.Features.Auth.Register;

public class RegisterValidator : BaseValidator<RegisterCommand>
{
    public RegisterValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty()
            .EmailAddress();
        
        RuleFor(x => x.Password)
            .MinimumLength(6)
            .WithMessage("Password must be at least 6 characters long.");
        
        RuleFor(x => x.Name)
            .NotEmpty();
    }
}