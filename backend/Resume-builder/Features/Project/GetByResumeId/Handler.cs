using System.Net;
using Microsoft.EntityFrameworkCore;
using Resume_builder.Common;
using Resume_builder.Features.Project.Common;
using Resume_builder.Infrastructure.Persistence.Data;
using Resume_builder.Infrastructure.Services.ClaimService;

namespace Resume_builder.Features.Project.GetByResumeId;

public class GetProjectsByResumeIdHandler(AppDbContext db, IClaimsService claimsService)
{
    public async Task<Response<List<ProjectDto>>> Handle(string resumeId, CancellationToken cancellationToken)
    {
        var userId = claimsService.GetUserId();

        if (userId is null)
            return Response<List<ProjectDto>>.Fail(HttpStatusCode.Unauthorized, "Unauthorized");

        // Verify the resume belongs to the user
        var resumeExists = await db.Resume
            .AnyAsync(r => r.Id == resumeId && r.UserId == userId, cancellationToken);

        if (!resumeExists)
            return Response<List<ProjectDto>>.Fail(HttpStatusCode.NotFound, "Resume not found");

        var projects = await db.Project
            .Where(p => p.ResumeId == resumeId && p.UserId == userId)
            .Include(p => p.BulletPoints)
            .AsNoTracking()
            .ToListAsync(cancellationToken);

        var projectDtos = projects.Select(p => p.ToDto()).ToList();

        return Response<List<ProjectDto>>.Success(projectDtos);
    }
}
