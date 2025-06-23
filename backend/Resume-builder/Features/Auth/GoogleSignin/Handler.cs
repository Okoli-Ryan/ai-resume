using System.Net;
using Google.Apis.Auth;
using Microsoft.Extensions.Options;
using Resume_builder.Common;
using Resume_builder.Features.Auth.Common;
using Resume_builder.Features.Auth.GoogleLogin;
using Resume_builder.Features.Users;
using Resume_builder.Infrastructure.Persistence.Data;
using Resume_builder.Infrastructure.Services.TokenService;

namespace Resume_builder.Features.Auth.GoogleSignin;

public class GoogleSigninHandler(
    AppDbContext db,
    IOptions<AppSettings> appSettings,
    ITokenService tokenService
) : IResponseHandler<GoogleSigninCommand, AuthResponse>
{
    public async Task<Response<AuthResponse>> Handle(GoogleSigninCommand command, CancellationToken cancellationToken)
    {
        var googleClientId = appSettings.Value.GoogleClientID;

        if (googleClientId is null)
            return Response<AuthResponse>.Fail(HttpStatusCode.InternalServerError, "Something went wrong");

        var payload = await GoogleJsonWebSignature.ValidateAsync(command.IdToken,
            new GoogleJsonWebSignature.ValidationSettings
            {
                Audience = new[] { googleClientId }
            });

        if (payload is null)
            return Response<AuthResponse>.Fail(HttpStatusCode.Unauthorized, "Unauthorized");

        var existingUser = db.User.FirstOrDefault(x => x.GoogleId == payload.Subject);

        if (existingUser is null)
            return await CreateAccount(payload, cancellationToken);

        return Login(existingUser);
    }

    private Response<AuthResponse> Login(User user)
    {
        var token = tokenService.Generate(user.Id, user.Email, null);

        return Response<AuthResponse>.Success(new AuthResponse
        {
            Token = token,
            User = user.ToDto()
        });
    }

    private async Task<Response<AuthResponse>> CreateAccount(GoogleJsonWebSignature.Payload googleAccountPayload,
        CancellationToken cancellationToken)
    {
        var user = new User
        {
            Email = googleAccountPayload.Email,
            Name = googleAccountPayload.Name,
            GoogleId = googleAccountPayload.Subject
        };

        db.User.Add(user);
        await db.SaveChangesAsync(cancellationToken);

        var token = tokenService.Generate(user.Id, user.Email, null);

        return Response<AuthResponse>.Success(new AuthResponse
        {
            Token = token,
            User = user.ToDto()
        });
    }
}