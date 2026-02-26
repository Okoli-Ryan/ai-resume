using System.Net;
using Microsoft.EntityFrameworkCore;
using Resume_builder.Common;
using Resume_builder.Infrastructure.Persistence.Data;
using Resume_builder.Infrastructure.Services.ClaimService;

namespace Resume_builder.Features.Skills.Delete;

public class DeleteSkillHandler(AppDbContext db, IClaimsService claimsService)
    : IResponseHandler<DeleteSkillCommand, bool>
{
    public async Task<Response<bool>> Handle(DeleteSkillCommand command,
        CancellationToken cancellationToken)
    {
        var userId = claimsService.GetUserId();

        if (userId is null)
            return Response<bool>.Fail(HttpStatusCode.Unauthorized, "Unauthorized");

        var skill = await db.Skill
            .FirstOrDefaultAsync(x => x.Id == command.SkillId && x.UserId == userId, cancellationToken);

        if (skill is null)
            return Response<bool>.Fail(HttpStatusCode.NotFound, "Skill not found");

        db.Skill.Remove(skill);
        await db.SaveChangesAsync(cancellationToken);

        return Response<bool>.Success(true);
    }
}
