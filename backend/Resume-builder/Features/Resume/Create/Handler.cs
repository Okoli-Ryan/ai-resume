using System.Net;
using Resume_builder.Common;
using Resume_builder.Features.Resume.Common;
using Resume_builder.Infrastructure.Persistence.Data;
using Resume_builder.Infrastructure.Services.ClaimService;
using static Resume_builder.Features.Resume.Common.ResumeExtensions;

namespace Resume_builder.Features.Resume.Create;

public class CreateResumeHandler(
    AppDbContext db,
    IHostEnvironment env,
    IClaimsService claimsService
)
    : IResponseHandler<CreateResumeCommand, ResumeDto>
{
    public async Task<Response<ResumeDto>> Handle(CreateResumeCommand request, CancellationToken cancellationToken)
    {
        var userId = claimsService.GetUserId();

        if (userId is null)
            return Response<ResumeDto>.Fail(HttpStatusCode.Unauthorized, "Unauthorized");

        var resume = CreateResumeEntity(request, userId);

        await using var transaction =
            env.IsProduction() ? await db.Database.BeginTransactionAsync(cancellationToken) : null;

        db.Resume.Add(resume);
        await db.SaveChangesAsync(cancellationToken);

        CreateEducationEntity(request, resume, userId);

        CreateWorkExperienceEntity(request, resume, userId);

        CreateProjectEntity(request, resume, userId);

        CreateSkillEntity(request, resume, userId);

        await db.SaveChangesAsync(cancellationToken);

        AssignWorkExperienceIdToBulletPoints(request, resume);

        AssignProjectIdToBulletPoints(request, resume);

        AssignEducationIdToBulletPoints(request, resume);

        await db.SaveChangesAsync(cancellationToken);

        if (env.IsProduction()) await transaction!.CommitAsync(cancellationToken);
        return Response<ResumeDto>.Success(resume.ToDto());
    }
}