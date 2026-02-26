using System.Net;
using Microsoft.EntityFrameworkCore;
using Resume_builder.Common;
using Resume_builder.Infrastructure.Persistence.Data;
using Resume_builder.Infrastructure.Services.ClaimService;

namespace Resume_builder.Features.Certification.Delete;

public class DeleteCertificationHandler(AppDbContext db, IClaimsService claimsService)
    : IResponseHandler<DeleteCertificationCommand, bool>
{
    public async Task<Response<bool>> Handle(DeleteCertificationCommand command,
        CancellationToken cancellationToken)
    {
        var userId = claimsService.GetUserId();

        if (userId is null)
            return Response<bool>.Fail(HttpStatusCode.Unauthorized, "Unauthorized");

        var certification = await db.Certification
            .Include(x => x.BulletPoints)
            .FirstOrDefaultAsync(x => x.Id == command.CertificationId && x.UserId == userId, cancellationToken);

        if (certification is null)
            return Response<bool>.Fail(HttpStatusCode.NotFound, "Certification not found");

        // Remove associated bullet points
        if (certification.BulletPoints.Count > 0)
        {
            db.BulletPoint.RemoveRange(certification.BulletPoints);
        }

        db.Certification.Remove(certification);
        await db.SaveChangesAsync(cancellationToken);

        return Response<bool>.Success(true);
    }
}
