using System.Net;
using Microsoft.EntityFrameworkCore;
using Resume_builder.Common;
using Resume_builder.Infrastructure.Persistence.Data;
using Resume_builder.Infrastructure.Services.ClaimService;

namespace Resume_builder.Features.WorkExperience.Delete;

public class DeleteWorkExperienceHandler(AppDbContext db, IClaimsService claimsService)
    : IResponseHandler<DeleteWorkExperienceCommand, bool>
{
    public async Task<Response<bool>> Handle(DeleteWorkExperienceCommand command,
        CancellationToken cancellationToken)
    {
        var userId = claimsService.GetUserId();

        if (userId is null)
            return Response<bool>.Fail(HttpStatusCode.Unauthorized, "Unauthorized");

        var workExperience = await db.WorkExperience
            .Include(x => x.BulletPoints)
            .FirstOrDefaultAsync(x => x.Id == command.WorkExperienceId && x.UserId == userId, cancellationToken);

        if (workExperience is null)
            return Response<bool>.Fail(HttpStatusCode.NotFound, "Work experience not found");

        // Remove associated bullet points
        if (workExperience.BulletPoints.Count > 0)
        {
            db.BulletPoint.RemoveRange(workExperience.BulletPoints);
        }

        db.WorkExperience.Remove(workExperience);
        await db.SaveChangesAsync(cancellationToken);

        return Response<bool>.Success(true);
    }
}
