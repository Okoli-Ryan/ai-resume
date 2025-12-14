using System.Net;
using Microsoft.EntityFrameworkCore;
using Resume_builder.Common;
using Resume_builder.Features.Link.Common;
using Resume_builder.Infrastructure.Persistence.Data;
using Resume_builder.Infrastructure.Services.ClaimService;

namespace Resume_builder.Features.Link.GetLinksByResume;

public class GetLinksByResumeHandler(AppDbContext db, IClaimsService claimsService)
    : IResponseHandler<GetLinksByResumeQuery, List<LinkDto>>
{
    public async Task<Response<List<LinkDto>>> Handle(GetLinksByResumeQuery query,
        CancellationToken cancellationToken)
    {
        var userId = claimsService.GetUserId();

        if (userId is null)
            return Response<List<LinkDto>>.Fail(HttpStatusCode.Unauthorized, "Unauthorized");

        var links = await db.Link
            .Where(x => x.ResumeId == query.ResumeId && x.UserId == userId)
            .ToListAsync(cancellationToken);

        var linkDtos = links.Select(x => x.ToDto()).ToList();

        return Response<List<LinkDto>>.Success(linkDtos);
    }
}
