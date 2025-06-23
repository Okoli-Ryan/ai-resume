using FluentValidation;
using Resume_builder.Common;
using Resume_builder.Features.Auth.GoogleLogin;

namespace Resume_builder.Features.Auth.GoogleSignin;

public class GoogleSigninValidator : BaseValidator<GoogleSigninCommand>
{
    public GoogleSigninValidator()
    {
        RuleFor(x => x.IdToken)
            .NotNull()
            .WithMessage("IdToken is required");
    }
}