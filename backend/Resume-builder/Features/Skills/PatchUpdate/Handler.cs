using System.Net;
using Microsoft.EntityFrameworkCore;
using Resume_builder.Common;
using Resume_builder.Features.Skills.Common;
using Resume_builder.Infrastructure.Persistence.Data;
using Resume_builder.Infrastructure.Services.ClaimService;
using Resume_builder.Utils;

namespace Resume_builder.Features.Skills.PatchUpdate;

public class PatchUpdateSkillHandler(
    AppDbContext db,
    IClaimsService claimsService) : IResponseHandler<PatchUpdateSkillCommand, SkillDto>
{
    /// <summary>
    ///     Property mappings from request properties to entity properties
    /// </summary>
    private static readonly Dictionary<string, string> PropertyMappings = new()
    {
        { nameof(PatchUpdateSkillRequest.Category), nameof(SkillEntity.Group) },
        { nameof(PatchUpdateSkillRequest.Skills), nameof(SkillEntity.Skills) },
    };

    public async Task<Response<SkillDto>> Handle(PatchUpdateSkillCommand command, CancellationToken cancellationToken)
    {
        var request = command.Request;

        var userId = claimsService.GetUserId();

        if (userId is null)
            return Response<SkillDto>.Fail(HttpStatusCode.Unauthorized, "Unauthorized");

        var skill = await db.Skill
            .Where(x => x.UserId == userId && x.Id == command.SkillId)
            .FirstOrDefaultAsync(cancellationToken);

        if (skill == null)
            return Response<SkillDto>.Fail(HttpStatusCode.NotFound, "Skill not found");

        // Apply patch update using the helper
        var hasUpdates = PatchUpdateHelper.ApplyPatch(request, skill, PropertyMappings);

        if (hasUpdates)
        {
            db.Skill.Update(skill);
            await db.SaveChangesAsync(cancellationToken);
        }

        return Response<SkillDto>.Success(skill.ToDto());
    }
}
