using System.Net;
using Microsoft.EntityFrameworkCore;
using Resume_builder.Common;
using Resume_builder.Features.Skills.Common;
using Resume_builder.Infrastructure.Persistence.Data;
using Resume_builder.Infrastructure.Services.ClaimService;

namespace Resume_builder.Features.Skills.Update;

public class UpdateSkillHandler(AppDbContext db, IClaimsService claimsService)
    : IResponseHandler<UpdateSkillCommand, SkillDto>
{
    public async Task<Response<SkillDto>> Handle(UpdateSkillCommand command, CancellationToken cancellationToken)
    {
        var userId = claimsService.GetUserId();
        var request = command.Request;

        if (userId is null)
            return Response<SkillDto>.Fail(HttpStatusCode.Unauthorized, "Unauthorized");

        var existingSkill =
            await db.Skill.FirstOrDefaultAsync(x => x.Id == command.SkillId && x.UserId == userId, cancellationToken);

        if (existingSkill is null)
            return Response<SkillDto>.Fail(HttpStatusCode.NotFound, "Skill Data not found");

        existingSkill.Group = request.Category;
        existingSkill.Skills = request.Skills;

        db.Skill.Update(existingSkill);
        await db.SaveChangesAsync(cancellationToken);

        return Response<SkillDto>.Success(existingSkill.ToDto());
    }
}