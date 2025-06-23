using System.Net;
using Microsoft.EntityFrameworkCore;
using Resume_builder.Common;
using Resume_builder.Features.Skills.Common;
using Resume_builder.Infrastructure.Persistence.Data;
using Resume_builder.Infrastructure.Services.ClaimService;

namespace Resume_builder.Features.Skills.UpdateByResumeId;

public class UpdateSkillsByResumeIdHandler(AppDbContext db, IClaimsService claimsService)
    : IResponseHandler<UpdateSkillsByResumeIdCommand, List<SkillDto>>
{
    public async Task<Response<List<SkillDto>>> Handle(UpdateSkillsByResumeIdCommand command,
        CancellationToken cancellationToken)
    {
        var request = command.Skills;
        var resumeId = command.ResumeId;

        var userId = claimsService.GetUserId();

        if (userId is null)
            return Response<List<SkillDto>>.Fail(HttpStatusCode.Unauthorized, "Unauthorized");

        var existingSkills = await db.Skill
            .Where(x => x.ResumeId == resumeId && x.UserId == userId)
            .ToListAsync(cancellationToken);

        db.Skill.RemoveRange(existingSkills);

        // Add new skills from the request
        var newSkills = request.Select(dto =>
        {
            var newSkill = new SkillEntity
            {
                Group = dto.Category,
                Skills = dto.Skills,
                UserId = userId,
                ResumeId = resumeId
            };

            return newSkill;
        }).ToList();

        await db.Skill.AddRangeAsync(newSkills, cancellationToken);
        await db.SaveChangesAsync(cancellationToken);

        return Response<List<SkillDto>>.Success(newSkills.Select(s => s.ToDto()).ToList());
    }
}
