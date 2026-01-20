using System.Net;
using Microsoft.EntityFrameworkCore;
using Resume_builder.Common;
using Resume_builder.Features.Resume.Common;
using Resume_builder.Infrastructure.Persistence.Data;
using Resume_builder.Infrastructure.Services.ClaimService;
using Resume_builder.Utils;

namespace Resume_builder.Features.Resume.Patch_Update_Order;

public class PatchUpdateOrderHandler(
    AppDbContext db,
    IClaimsService claimsService) : IResponseHandler<PatchUpdateOrderCommand, ResumeDto>
{
    /// <summary>
    ///     Property mappings from request properties to entity properties
    /// </summary>
    private static readonly Dictionary<string, string> PropertyMappings = new()
    {
        { nameof(PatchUpdateOrderRequest.Order), nameof(ResumeEntity.Order) },
    };

    public async Task<Response<ResumeDto>> Handle(PatchUpdateOrderCommand command, CancellationToken cancellationToken)
    {
        var request = command.Request;

        var userId = claimsService.GetUserId();

        if (userId is null)
            return Response<ResumeDto>.Fail(HttpStatusCode.Unauthorized, "Unauthorized");

        var resume = await db.Resume
            .Where(x => x.UserId == userId && x.Id == command.ResumeId)
            .FirstOrDefaultAsync(cancellationToken);

        if (resume == null)
            return Response<ResumeDto>.Fail(HttpStatusCode.NotFound, "Resume not found");

        // Apply patch update using the helper
        var hasUpdates = PatchUpdateHelper.ApplyPatch(request, resume, PropertyMappings);

        if (hasUpdates)
        {
            db.Resume.Update(resume);
            await db.SaveChangesAsync(cancellationToken);
        }

        return Response<ResumeDto>.Success(resume.ToDto());
    }
}
