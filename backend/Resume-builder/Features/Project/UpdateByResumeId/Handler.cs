using System.Net;
using Microsoft.EntityFrameworkCore;
using Resume_builder.Common;
using Resume_builder.Features.BulletPoint.Common;
using Resume_builder.Features.Project.Common;
using Resume_builder.Infrastructure.Persistence.Data;
using Resume_builder.Infrastructure.Services.ClaimService;

namespace Resume_builder.Features.Project.UpdateByResumeId;

public class UpdateProjectsByResumeIdHandler(AppDbContext db, IClaimsService claimsService)
    : IResponseHandler<UpdateProjectsByResumeIdCommand, List<ProjectDto>>
{
    public async Task<Response<List<ProjectDto>>> Handle(UpdateProjectsByResumeIdCommand command,
        CancellationToken cancellationToken)
    {
        var request = command.Projects;
        var resumeId = command.ResumeId;

        var userId = claimsService.GetUserId();

        if (userId is null)
            return Response<List<ProjectDto>>.Fail(HttpStatusCode.Unauthorized, "Unauthorized");

        var existingProjects = await db.Project
            .Where(x => x.ResumeId == resumeId && x.UserId == userId)
            .Include(x => x.BulletPoints)
            .ToListAsync(cancellationToken);

        db.Project.RemoveRange(existingProjects);

        // Add new projects from the request
        var newProjects = request.Select(dto =>
        {
            var newProject = new ProjectEntity
            {
                ProjectName = dto.Name,
                ProjectUrl = dto.Link,
                UserId = userId,
                ResumeId = resumeId,
            };
            
            newProject.BulletPoints = dto.BulletPoints.Select(bp =>
            {
                var bullet = bp.ToEntity();
                bullet.Project = newProject;
                return bullet;
            }).ToList();

            return newProject;
        }).ToList();

        await db.Project.AddRangeAsync(newProjects, cancellationToken);
        await db.SaveChangesAsync(cancellationToken);

        return Response<List<ProjectDto>>.Success(newProjects.Select(p => p.ToDto()).ToList());
    }
}