using System.Net;
using Microsoft.EntityFrameworkCore;
using Resume_builder.Common;
using Resume_builder.Features.Resume.Common;
using Resume_builder.Infrastructure.Persistence.Data;
using Resume_builder.Infrastructure.Services.ClaimService;

namespace Resume_builder.Features.Resume.GetResumesByUserId;

public class GetResumesByUserIdHandler(AppDbContext db, IClaimsService claimsService)
{
    public async Task<Response<List<ResumeDto>>> Handle(string requestUserId, CancellationToken cancellationToken)
    {
        var userId = claimsService.GetUserId();

        if (userId is null || userId != requestUserId)
            return Response<List<ResumeDto>>.Fail(HttpStatusCode.Unauthorized, "Unauthorized");

        var resumes = await db.Resume
            .Where(x => x.UserId == userId)
            .Include(x => x.Projects)
            .ThenInclude(x => x.BulletPoints)
            .Include(x => x.Education)
            .ThenInclude(x => x.BulletPoints)
            .Include(x => x.WorkExperience)
            .ThenInclude(x => x.BulletPoints)
            .ToListAsync(cancellationToken);

        return Response<List<ResumeDto>>.Success(resumes.ToDto());
    }
}