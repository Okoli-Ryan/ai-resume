using System.Net;
using Microsoft.EntityFrameworkCore;
using Resume_builder.Common;
using Resume_builder.Features.Resume.Common;
using Resume_builder.Infrastructure.Persistence.Data;
using Resume_builder.Infrastructure.Services.ClaimService;

namespace Resume_builder.Features.Resume.GetResumesByUserId;

public class GetResumeByIdHandler(AppDbContext db, IClaimsService claimsService)
{
    public async Task<Response<ResumeDto>> Handle(string resumeId, CancellationToken cancellationToken)
    {
        var userId = claimsService.GetUserId();

        if (userId is null)
            return Response<ResumeDto>.Fail(HttpStatusCode.Unauthorized, "Unauthorized");

        var resume = await db.Resume
            .Where(x => x.UserId == userId && x.Id == resumeId)
            .Include(x => x.Projects)
            .ThenInclude(x => x.BulletPoints)
            .Include(x => x.Education)
            .ThenInclude(x => x.BulletPoints)
            .Include(x => x.WorkExperience)
            .ThenInclude(x => x.BulletPoints)
            .Include(x => x.Skills)
            .FirstOrDefaultAsync(cancellationToken);

        if (resume is null)
            return Response<ResumeDto>.Fail(HttpStatusCode.NotFound, "Resume not found");

        return Response<ResumeDto>.Success(resume.ToDto());
    }
}