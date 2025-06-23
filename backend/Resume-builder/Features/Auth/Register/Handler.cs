using System.Net;
using Microsoft.EntityFrameworkCore;
using Resume_builder.Common;
using Resume_builder.Features.Users;
using Resume_builder.Features.Users.Common;
using Resume_builder.Infrastructure.Persistence.Data;
using Resume_builder.Infrastructure.Services.PasswordService;

namespace Resume_builder.Features.Auth.Register;

public class RegisterHandler(IPasswordService passwordService, AppDbContext db)
    : IResponseHandler<RegisterCommand, UserDto>
{
    public async Task<Response<UserDto>> Handle(RegisterCommand request, CancellationToken cancellationToken)
    {
        var existingUser = await db.User.FirstOrDefaultAsync(x => x.Email == request.Email, cancellationToken);

        if (existingUser is not null)
            return Response<UserDto>.Fail(HttpStatusCode.BadRequest,
                "User with this email already exists");

        var hash = passwordService.Hash(request.Password);

        var user = new User
        {
            Email = request.Email,
            Name = request.Name,
            PasswordHash = hash
        };

        db.User.Add(user);
        await db.SaveChangesAsync(cancellationToken);

        return Response<UserDto>.Success(user.ToDto());
    }
}