using System.Net;
using Microsoft.EntityFrameworkCore;
using Resume_builder.Common;
using Resume_builder.Infrastructure.Persistence.Data;
using Resume_builder.Infrastructure.Services.ClaimService;

namespace Resume_builder.Features.Education.Delete;

public class DeleteEducationHandler(AppDbContext db, IClaimsService claimsService)
    : IResponseHandler<DeleteEducationCommand, bool>
{
    public async Task<Response<bool>> Handle(DeleteEducationCommand command,
        CancellationToken cancellationToken)
    {
        var userId = claimsService.GetUserId();

        if (userId is null)
            return Response<bool>.Fail(HttpStatusCode.Unauthorized, "Unauthorized");

        var education = await db.Education
            .Include(x => x.BulletPoints)
            .FirstOrDefaultAsync(x => x.Id == command.EducationId && x.UserId == userId, cancellationToken);

        if (education is null)
            return Response<bool>.Fail(HttpStatusCode.NotFound, "Education not found");

        // Remove associated bullet points
        if (education.BulletPoints.Count > 0)
        {
            db.BulletPoint.RemoveRange(education.BulletPoints);
        }

        db.Education.Remove(education);
        await db.SaveChangesAsync(cancellationToken);

        return Response<bool>.Success(true);
    }
}
