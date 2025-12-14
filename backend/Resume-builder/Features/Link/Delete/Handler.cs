using System.Net;
using Microsoft.EntityFrameworkCore;
using Resume_builder.Common;
using Resume_builder.Infrastructure.Persistence.Data;
using Resume_builder.Infrastructure.Services.ClaimService;

namespace Resume_builder.Features.Link.Delete;

public class DeleteLinkHandler(AppDbContext db, IClaimsService claimsService)
    : IResponseHandler<DeleteLinkCommand, bool>
{
    public async Task<Response<bool>> Handle(DeleteLinkCommand command,
        CancellationToken cancellationToken)
    {
        var userId = claimsService.GetUserId();

        if (userId is null)
            return Response<bool>.Fail(HttpStatusCode.Unauthorized, "Unauthorized");

        var link = await db.Link
            .FirstOrDefaultAsync(x => x.Id == command.LinkId && x.UserId == userId, cancellationToken);

        if (link is null)
            return Response<bool>.Fail(HttpStatusCode.NotFound, "Link not found");

        db.Link.Remove(link);
        await db.SaveChangesAsync(cancellationToken);

        return Response<bool>.Success(true);
    }
}
