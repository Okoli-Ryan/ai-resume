using System.Net;
using Resume_builder.Common;
using Resume_builder.Features.Skills.Common;
using Resume_builder.Infrastructure.Persistence.Data;
using Resume_builder.Infrastructure.Services.ClaimService;

namespace Resume_builder.Features.Skills.Create;

public class CreateSkillHandler(AppDbContext db, IClaimsService claimsService)
    : IResponseHandler<CreateSkillCommand, SkillDto>
{
    public async Task<Response<SkillDto>> Handle(CreateSkillCommand command, CancellationToken cancellationToken)
    {
        var userId = claimsService.GetUserId();

        if (userId is null)
            return Response<SkillDto>.Fail(HttpStatusCode.Unauthorized, "Unauthorized");

        var skill = new SkillEntity
        {
            Group = command.Group,
            Skills = command.Skills,
            ResumeId = command.ResumeId,
            UserId = userId
        };

        db.Skill.Add(skill);
        await db.SaveChangesAsync(cancellationToken);

        return Response<SkillDto>.Success(skill.ToDto());
    }
}