using System.Net;
using Resume_builder.Common;
using Resume_builder.Features.BulletPoint.Common;
using Resume_builder.Features.WorkExperience.Common;
using Resume_builder.Infrastructure.Persistence.Data;
using Resume_builder.Infrastructure.Services.ClaimService;

namespace Resume_builder.Features.WorkExperience.Create;

public class CreateWorkExperienceHandler(AppDbContext db, IClaimsService claimsService)
    : IResponseHandler<CreateWorkExperienceCommand, WorkExperienceDto>
{
    public async Task<Response<WorkExperienceDto>> Handle(CreateWorkExperienceCommand command,
        CancellationToken cancellationToken)
    {
        var userId = claimsService.GetUserId();

        if (userId is null)
            return Response<WorkExperienceDto>.Fail(HttpStatusCode.Unauthorized, "Unauthorized");

        var workExperience = new WorkExperienceEntity
        {
            ResumeId = command.ResumeId,
            CompanyName = command.CompanyName,
            CompanyLink = command.CompanyLink,
            Title = command.Title,
            StartDate = command.StartDate,
            WorkType = command.WorkType,
            UserId = userId,
            EndDate = command.EndDate,
            IsOngoing = command.IsOngoing,
            Location = command.Location,
            BulletPoints = command.BulletPoints.Select(x => x.ToEntity()).ToList()
        };

        db.WorkExperience.Add(workExperience);

        await db.SaveChangesAsync(cancellationToken);

        return Response<WorkExperienceDto>.Success(workExperience.ToDto());
    }
}