using System.Net;
using Microsoft.EntityFrameworkCore;
using Resume_builder.Common;
using Resume_builder.Features.Skills.Common;
using Resume_builder.Infrastructure.Persistence.Data;
using Resume_builder.Infrastructure.Services.ClaimService;

namespace Resume_builder.Features.Skills.GetByResumeId;

public class GetSkillsByResumeIdHandler(AppDbContext db, IClaimsService claimsService)
{
    public async Task<Response<List<SkillDto>>> Handle(string resumeId, CancellationToken cancellationToken)
    {
        var userId = claimsService.GetUserId();

        if (userId is null)
            return Response<List<SkillDto>>.Fail(HttpStatusCode.Unauthorized, "Unauthorized");

        // Verify the resume belongs to the user
        var resumeExists = await db.Resume
            .AnyAsync(r => r.Id == resumeId && r.UserId == userId, cancellationToken);

        if (!resumeExists)
            return Response<List<SkillDto>>.Fail(HttpStatusCode.NotFound, "Resume not found");

        var skills = await db.Skill
            .Where(s => s.ResumeId == resumeId && s.UserId == userId)
            .AsNoTracking()
            .ToListAsync(cancellationToken);

        var skillDtos = skills.Select(s => s.ToDto()).ToList();

        return Response<List<SkillDto>>.Success(skillDtos);
    }
}
