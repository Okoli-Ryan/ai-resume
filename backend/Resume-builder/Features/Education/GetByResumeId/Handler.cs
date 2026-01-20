using System.Net;
using Microsoft.EntityFrameworkCore;
using Resume_builder.Common;
using Resume_builder.Features.Education.Common;
using Resume_builder.Infrastructure.Persistence.Data;
using Resume_builder.Infrastructure.Services.ClaimService;

namespace Resume_builder.Features.Education.GetByResumeId;

public class GetEducationByResumeIdHandler(AppDbContext db, IClaimsService claimsService)
{
    public async Task<Response<List<EducationDto>>> Handle(string resumeId, CancellationToken cancellationToken)
    {
        var userId = claimsService.GetUserId();

        if (userId is null)
            return Response<List<EducationDto>>.Fail(HttpStatusCode.Unauthorized, "Unauthorized");

        // Verify the resume belongs to the user
        var resumeExists = await db.Resume
            .AnyAsync(r => r.Id == resumeId && r.UserId == userId, cancellationToken);

        if (!resumeExists)
            return Response<List<EducationDto>>.Fail(HttpStatusCode.NotFound, "Resume not found");

        var educations = await db.Education
            .Where(e => e.ResumeId == resumeId && e.UserId == userId)
            .Include(e => e.BulletPoints)
            .AsNoTracking()
            .ToListAsync(cancellationToken);

        var educationDtos = educations.Select(e => e.ToDto()).ToList();

        return Response<List<EducationDto>>.Success(educationDtos);
    }
}
