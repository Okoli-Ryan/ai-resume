using System.Net;
using Microsoft.EntityFrameworkCore;
using Resume_builder.Common;
using Resume_builder.Features.Link.Common;
using Resume_builder.Infrastructure.Persistence.Data;
using Resume_builder.Infrastructure.Services.ClaimService;

namespace Resume_builder.Features.Link.Update;

public class UpdateLinkHandler(AppDbContext db, IClaimsService claimsService)
    : IResponseHandler<UpdateLinkCommand, LinkDto>
{
    public async Task<Response<LinkDto>> Handle(UpdateLinkCommand command,
        CancellationToken cancellationToken)
    {
        var request = command.Request;

        var userId = claimsService.GetUserId();

        if (userId is null)
            return Response<LinkDto>.Fail(HttpStatusCode.Unauthorized, "Unauthorized");

        var link = await db.Link
            .FirstOrDefaultAsync(x => x.Id == command.LinkId && x.UserId == userId, cancellationToken);

        if (link is null)
            return Response<LinkDto>.Fail(HttpStatusCode.NotFound, "Link not found");

        link.LinkName = request.LinkName;
        link.Url = request.Url;

        db.Link.Update(link);
        await db.SaveChangesAsync(cancellationToken);

        return Response<LinkDto>.Success(link.ToDto());
    }
}
