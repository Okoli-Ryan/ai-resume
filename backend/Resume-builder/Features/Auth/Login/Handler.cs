using System.Net;
using Microsoft.EntityFrameworkCore;
using Resume_builder.Common;
using Resume_builder.Features.Auth.Common;
using Resume_builder.Features.Users;
using Resume_builder.Infrastructure.Persistence.Data;
using Resume_builder.Infrastructure.Services.PasswordService;
using Resume_builder.Infrastructure.Services.TokenService;

namespace Resume_builder.Features.Auth.Login;

public class LoginHandler(ITokenService tokenService, IPasswordService passwordService, AppDbContext db)
    : IResponseHandler<LoginCommand, AuthResponse>
{
    public async Task<Response<AuthResponse>> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        var user = await db.User.FirstOrDefaultAsync(x => x.Email == request.Email, cancellationToken);

        if (user is null || !passwordService.Verify(user.PasswordHash, request.Password))
            return Response<AuthResponse>.Fail(HttpStatusCode.BadRequest, "Invalid credentials");

        var token = tokenService.Generate(user.Id, user.Email, null);

        var response = new AuthResponse
        {
            Token = token,
            User = user.ToDto()
        };

        return Response<AuthResponse>.Success(response);
    }
}