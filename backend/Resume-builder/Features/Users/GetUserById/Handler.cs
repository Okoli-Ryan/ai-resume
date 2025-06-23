using System.Net;
using Microsoft.EntityFrameworkCore;
using Resume_builder.Common;
using Resume_builder.Features.Users.Common;
using Resume_builder.Infrastructure.Persistence.Data;

namespace Resume_builder.Features.Users.GetUserById;

public class GetUserByIdHandler(AppDbContext db)
{
    public async Task<Response<UserDto>> Handle(GetUserByIdQuery query, CancellationToken cancellationToken)
    {
        var user = await db.User.FirstOrDefaultAsync(x => x.Id == query.UserId, cancellationToken);

        if (user is null) return Response<UserDto>.Fail(HttpStatusCode.NotFound, "User not found");

        return Response<UserDto>.Success(user.ToDto());
    }
}