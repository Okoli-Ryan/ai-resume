using System.Net;
using Microsoft.EntityFrameworkCore;
using Resume_builder.Common;
using Resume_builder.Features.Link.Common;
using Resume_builder.Infrastructure.Persistence.Data;
using Resume_builder.Infrastructure.Services.ClaimService;

namespace Resume_builder.Features.Link.GetLinksByUser;

public class GetLinksByUserHandler(AppDbContext db, IClaimsService claimsService)
    : IResponseHandler<GetLinksByUserQuery, List<LinkDto>>
{
    public async Task<Response<List<LinkDto>>> Handle(GetLinksByUserQuery query,
        CancellationToken cancellationToken)
    {
        var userId = claimsService.GetUserId();

        if (userId is null)
            return Response<List<LinkDto>>.Fail(HttpStatusCode.Unauthorized, "Unauthorized");

        var links = await db.Link
            .Where(x => x.UserId == userId)
            .ToListAsync(cancellationToken);

        var linkDtos = links.Select(x => x.ToDto()).ToList();

        return Response<List<LinkDto>>.Success(linkDtos);
    }
}
