using System.Net;
using Microsoft.EntityFrameworkCore;
using Resume_builder.Common;
using Resume_builder.Features.Link.Common;
using Resume_builder.Infrastructure.Persistence.Data;
using Resume_builder.Infrastructure.Services.ClaimService;
using Resume_builder.Utils;

using LinkDto = Resume_builder.Features.Link.LinkDto;

namespace Resume_builder.Features.Link.PatchUpdate;

public class PatchUpdateLinkHandler(
    AppDbContext db,
    IClaimsService claimsService) : IResponseHandler<PatchUpdateLinkCommand, LinkDto>
{
    /// <summary>
    ///     Property mappings from request properties to entity properties
    /// </summary>
    private static readonly Dictionary<string, string> PropertyMappings = new()
    {
        { nameof(PatchUpdateLinkRequest.Name), nameof(LinkEntity.LinkName) },
        { nameof(PatchUpdateLinkRequest.Url), nameof(LinkEntity.Url) },
        { nameof(PatchUpdateLinkRequest.Index), nameof(LinkEntity.Index) },
    };

    public async Task<Response<LinkDto>> Handle(PatchUpdateLinkCommand command, CancellationToken cancellationToken)
    {
        var request = command.Request;

        var userId = claimsService.GetUserId();

        if (userId is null)
            return Response<LinkDto>.Fail(HttpStatusCode.Unauthorized, "Unauthorized");

        var link = await db.Link
            .Where(x => x.UserId == userId && x.Id == command.LinkId)
            .FirstOrDefaultAsync(cancellationToken);

        if (link == null)
            return Response<LinkDto>.Fail(HttpStatusCode.NotFound, "Link not found");

        // Apply patch update using the helper
        var hasUpdates = PatchUpdateHelper.ApplyPatch(request, link, PropertyMappings);

        if (hasUpdates)
        {
            db.Link.Update(link);
            await db.SaveChangesAsync(cancellationToken);
        }

        return Response<LinkDto>.Success(link.ToDto());
    }
}
