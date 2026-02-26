using System.Net;
using Microsoft.EntityFrameworkCore;
using Resume_builder.Common;
using Resume_builder.Infrastructure.Persistence.Data;
using Resume_builder.Infrastructure.Services.ClaimService;

namespace Resume_builder.Features.Project.Delete;

public class DeleteProjectHandler(AppDbContext db, IClaimsService claimsService)
    : IResponseHandler<DeleteProjectCommand, bool>
{
    public async Task<Response<bool>> Handle(DeleteProjectCommand command,
        CancellationToken cancellationToken)
    {
        var userId = claimsService.GetUserId();

        if (userId is null)
            return Response<bool>.Fail(HttpStatusCode.Unauthorized, "Unauthorized");

        var project = await db.Project
            .Include(x => x.BulletPoints)
            .FirstOrDefaultAsync(x => x.Id == command.ProjectId && x.UserId == userId, cancellationToken);

        if (project is null)
            return Response<bool>.Fail(HttpStatusCode.NotFound, "Project not found");

        // Remove associated bullet points
        if (project.BulletPoints.Count > 0)
        {
            db.BulletPoint.RemoveRange(project.BulletPoints);
        }

        db.Project.Remove(project);
        await db.SaveChangesAsync(cancellationToken);

        return Response<bool>.Success(true);
    }
}
