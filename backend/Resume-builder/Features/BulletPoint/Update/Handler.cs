using System.Net;
using Microsoft.EntityFrameworkCore;
using Resume_builder.Common;
using Resume_builder.Features.BulletPoint.Common;
using Resume_builder.Infrastructure.Persistence.Data;
using Resume_builder.Infrastructure.Services.ClaimService;

namespace Resume_builder.Features.BulletPoint.Update;

public class UpdateBulletPointHandler(AppDbContext db, IClaimsService claimsService)
    : IResponseHandler<UpdateBulletPointCommand, BulletPointDto>
{
    public async Task<Response<BulletPointDto>> Handle(UpdateBulletPointCommand command,
        CancellationToken cancellationToken)
    {
        var userId = claimsService.GetUserId();

        if (userId is null)
            return Response<BulletPointDto>.Fail(HttpStatusCode.Unauthorized, "Unauthorized");

        var bulletPoint = await db.BulletPoint
            .FirstOrDefaultAsync(bp => bp.Id == command.BulletPointId, cancellationToken);

        if (bulletPoint is null)
            return Response<BulletPointDto>.Fail(HttpStatusCode.NotFound, "Bullet point not found");

        bulletPoint.Text = command.Request.Text;
        bulletPoint.UpdatedAt = DateTime.UtcNow;

        db.BulletPoint.Update(bulletPoint);
        await db.SaveChangesAsync(cancellationToken);

        return Response<BulletPointDto>.Success(bulletPoint.ToDto());
    }
}