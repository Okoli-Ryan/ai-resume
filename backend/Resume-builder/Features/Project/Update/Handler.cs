using System.Net;
using Microsoft.EntityFrameworkCore;
using Resume_builder.Common;
using Resume_builder.Features.BulletPoint.Common;
using Resume_builder.Features.Project.Common;
using Resume_builder.Infrastructure.Persistence.Data;
using Resume_builder.Infrastructure.Services.ClaimService;

namespace Resume_builder.Features.Project.Update;

public class UpdateProjectHandler(AppDbContext db, IClaimsService claimsService)
    : IResponseHandler<UpdateProjectCommand, ProjectDto>
{
    public async Task<Response<ProjectDto>> Handle(UpdateProjectCommand command, CancellationToken cancellationToken)
    {
        var request = command.Request;

        var userId = claimsService.GetUserId();

        if (userId is null)
            return Response<ProjectDto>.Fail(HttpStatusCode.Unauthorized, "Unauthorized");

        var project = await db.Project
            .Include(x => x.BulletPoints)
            .FirstOrDefaultAsync(x => x.Id == command.ProjectId && x.UserId == userId, cancellationToken);

        if (project is null)
            return Response<ProjectDto>.Fail(HttpStatusCode.NotFound, "Project Data not found");

        project.ProjectName = request.Name;
        project.ProjectUrl = request.Link;
        project.BulletPoints = request.BulletPoints.Select(x => x.ToEntity()).ToList() ?? [];

        db.BulletPoint.RemoveRange(project.BulletPoints);


        db.Project.Update(project);

        await db.SaveChangesAsync(cancellationToken);

        return Response<ProjectDto>.Success(project.ToDto());
    }
}