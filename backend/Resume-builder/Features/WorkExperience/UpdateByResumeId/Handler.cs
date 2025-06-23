using System.Net;
using Microsoft.EntityFrameworkCore;
using Resume_builder.Common;
using Resume_builder.Features.BulletPoint.Common;
using Resume_builder.Features.WorkExperience.Common;
using Resume_builder.Infrastructure.Persistence.Data;
using Resume_builder.Infrastructure.Services.ClaimService;

namespace Resume_builder.Features.WorkExperience.UpdateByResumeId;

public class UpdateWorkExperienceByResumeIdHandler(AppDbContext db, IClaimsService claimsService)
    : IResponseHandler<UpdateWorkExperienceByResumeIdCommand, List<WorkExperienceDto>>
{
    public async Task<Response<List<WorkExperienceDto>>> Handle(UpdateWorkExperienceByResumeIdCommand command,
        CancellationToken cancellationToken)
    {
        var request = command.WorkExperiences;
        var resumeId = command.ResumeId;

        var userId = claimsService.GetUserId();

        if (userId is null)
            return Response<List<WorkExperienceDto>>.Fail(HttpStatusCode.Unauthorized, "Unauthorized");

        var existingWorkExperiences = await db.WorkExperience
            .Where(x => x.ResumeId == resumeId && x.UserId == userId)
            .Include(x => x.BulletPoints)
            .ToListAsync(cancellationToken);

        db.WorkExperience.RemoveRange(existingWorkExperiences);

        // Add new work experiences from the request
        var newWorkExperiences = request.Select(dto =>
        {
            var newWorkExperience = new WorkExperienceEntity
            {
                CompanyName = dto.CompanyName,
                CompanyLink = dto.CompanyLink,
                Title = dto.Title,
                Location = dto.Location,
                WorkType = dto.WorkType,
                IsOngoing = dto.IsOngoing,
                StartDate = dto.StartDate,
                EndDate = dto.EndDate,
                UserId = userId,
                ResumeId = resumeId,

            };
            
            newWorkExperience.BulletPoints = dto.BulletPoints.Select(bp =>
            {
                var bullet = bp.ToEntity();
                bullet.WorkExperience = newWorkExperience;
                return bullet;
            }).ToList();

            return newWorkExperience;
        }).ToList();

        await db.WorkExperience.AddRangeAsync(newWorkExperiences, cancellationToken);
        await db.SaveChangesAsync(cancellationToken);

        return Response<List<WorkExperienceDto>>.Success(newWorkExperiences.Select(w => w.ToDto()).ToList());
    }
}
