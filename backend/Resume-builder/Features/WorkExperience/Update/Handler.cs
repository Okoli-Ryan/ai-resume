using System.Net;
using Microsoft.EntityFrameworkCore;
using Resume_builder.Common;
using Resume_builder.Features.BulletPoint.Common;
using Resume_builder.Features.WorkExperience.Common;
using Resume_builder.Infrastructure.Persistence.Data;
using Resume_builder.Infrastructure.Services.ClaimService;

namespace Resume_builder.Features.WorkExperience.Update;

public class UpdateWorkExperienceHandler(AppDbContext db, IClaimsService claimsService)
    : IResponseHandler<UpdateWorkExperienceCommand, WorkExperienceDto>
{
    public async Task<Response<WorkExperienceDto>> Handle(UpdateWorkExperienceCommand command,
        CancellationToken cancellationToken)
    {
        var request = command.Request;

        var userId = claimsService.GetUserId();

        if (userId is null)
            return Response<WorkExperienceDto>.Fail(HttpStatusCode.Unauthorized, "Unauthorized");

        var workExperience = await db.WorkExperience
            .Include(w => w.BulletPoints)
            .FirstOrDefaultAsync(w => w.Id == command.WorkExperienceId, cancellationToken);

        if (workExperience is null)
            return Response<WorkExperienceDto>.Fail(HttpStatusCode.NotFound, "Work Experience data not found");

        workExperience.UserId = userId;
        workExperience.CompanyName = request.CompanyName;
        workExperience.CompanyLink = request.CompanyLink;
        workExperience.IsOngoing = request.IsOngoing;
        workExperience.Title = request.Title;
        workExperience.Location = request.Location;
        workExperience.StartDate = request.StartDate;
        workExperience.WorkType = request.WorkType;
        workExperience.EndDate = request.EndDate;
        workExperience.UpdatedAt = DateTime.UtcNow;
        workExperience.BulletPoints = request.BulletPoints.Select(x => x.ToEntity()).ToList();

        db.WorkExperience.Update(workExperience);

        await db.SaveChangesAsync(cancellationToken);

        return Response<WorkExperienceDto>.Success(workExperience.ToDto());
    }
}