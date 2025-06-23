using Carter;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Resume_builder.Common;
using Resume_builder.Features.Auth.GoogleLogin;
using Resume_builder.Features.Auth.GoogleSignin;
using Resume_builder.Features.Auth.Login;
using Resume_builder.Features.Auth.Register;
using Resume_builder.Infrastructure.Persistence.Data;
using Resume_builder.Infrastructure.Services.PasswordService;
using Resume_builder.Infrastructure.Services.TokenService;

namespace Resume_builder.Features.Auth;

public class AuthModule : CarterModule
{
    public override void AddRoutes(IEndpointRouteBuilder app)
    {
        var endpoint = app.MapGroup("auth").WithTags("Auth");

        endpoint.MapPost("login", async (
            [FromBody] LoginCommand request,
            IPasswordService passwordService,
            LoginValidator validator,
            ITokenService tokenService,
            AppDbContext db,
            CancellationToken cancellationToken) =>
        {
            var validationResult = await validator.ValidateRequest(request);

            if (validationResult != null)
                return Results.BadRequest(validationResult);

            var handler = new LoginHandler(tokenService, passwordService, db);
            var result = await handler.Handle(request, cancellationToken);

            return result.GetResult();
        }).WithTags("Auth");


        endpoint.MapPost("register", async (
            RegisterCommand command,
            IPasswordService passwordService,
            RegisterValidator validator,
            AppDbContext db,
            CancellationToken cancellationToken
        ) =>
        {
            var validationResult = await validator.ValidateRequest(command);

            if (validationResult != null)
                return Results.BadRequest(validationResult);

            var handler = new RegisterHandler(passwordService, db);
            var result = await handler.Handle(command, cancellationToken);

            return result.GetResult();
        });


        endpoint.MapPost("google", async (
            GoogleSigninCommand command,
            GoogleSigninValidator validator,
            IOptions<AppSettings> appSettings,
            AppDbContext db,
            ITokenService tokenService,
            CancellationToken cancellationToken
        ) =>
        {
            var validationResult = await validator.ValidateRequest(command);

            if (validationResult != null)
                return Results.BadRequest(validationResult);

            var handler = new GoogleSigninHandler(db, appSettings, tokenService);
            var result = await handler.Handle(command, cancellationToken);

            return result.GetResult();
        });
    }
}