using System.Net;
using Microsoft.EntityFrameworkCore;
using Resume_builder.Common;
using Resume_builder.Features.WorkExperience.Common;
using Resume_builder.Infrastructure.Persistence.Data;
using Resume_builder.Infrastructure.Services.ClaimService;

namespace Resume_builder.Features.WorkExperience.GetByResumeId;

public class GetWorkExperienceByResumeIdHandler(AppDbContext db, IClaimsService claimsService)
{
    public async Task<Response<List<WorkExperienceDto>>> Handle(string resumeId, CancellationToken cancellationToken)
    {
        var userId = claimsService.GetUserId();

        if (userId is null)
            return Response<List<WorkExperienceDto>>.Fail(HttpStatusCode.Unauthorized, "Unauthorized");

        // Verify the resume belongs to the user
        var resumeExists = await db.Resume
            .AnyAsync(r => r.Id == resumeId && r.UserId == userId, cancellationToken);

        if (!resumeExists)
            return Response<List<WorkExperienceDto>>.Fail(HttpStatusCode.NotFound, "Resume not found");

        var workExperiences = await db.WorkExperience
            .Where(w => w.ResumeId == resumeId && w.UserId == userId)
            .Include(w => w.BulletPoints)
            .AsNoTracking()
            .ToListAsync(cancellationToken);

        var workExperienceDtos = workExperiences.Select(w => w.ToDto()).ToList();

        return Response<List<WorkExperienceDto>>.Success(workExperienceDtos);
    }
}
