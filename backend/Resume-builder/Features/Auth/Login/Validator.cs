using FluentValidation;
using Resume_builder.Common;

namespace Resume_builder.Features.Auth.Login;

public class LoginValidator : BaseValidator<LoginCommand>
{
    public LoginValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty()
            .EmailAddress();
        
        RuleFor(x => x.Password)
            .NotEmpty()
            .MinimumLength(6);
    }
}