using System.Net;
using Microsoft.EntityFrameworkCore;
using Resume_builder.Common;
using Resume_builder.Features.BulletPoint;
using Resume_builder.Features.BulletPoint.Common;
using Resume_builder.Features.Education.Common;
using Resume_builder.Infrastructure.Persistence.Data;
using Resume_builder.Infrastructure.Services.ClaimService;

namespace Resume_builder.Features.Education.UpdateByResumeId;

public class UpdateEducationByResumeIdHandler(AppDbContext db, IClaimsService claimsService)
    : IResponseHandler<UpdateEducationByResumeIdCommand, List<EducationDto>>
{
    public async Task<Response<List<EducationDto>>> Handle(UpdateEducationByResumeIdCommand command,
        CancellationToken cancellationToken)
    {
        var request = command.Requests;
        var resumeId = command.ResumeId;

        var userId = claimsService.GetUserId();

        if (userId is null)
            return Response<List<EducationDto>>.Fail(HttpStatusCode.Unauthorized, "Unauthorized");

        var existingEducations = await db.Education
            .Where(x => x.ResumeId == command.ResumeId && x.UserId == userId)
            .Include(x => x.BulletPoints)
            .ToListAsync(cancellationToken);

        db.Education.RemoveRange(existingEducations);

        // Add new educations from the request
        var newEducations = request.Select(dto =>
        {
            var newEdu = new EducationEntity
            {
                SchoolName = dto.SchoolName,
                Degree = dto.Degree,
                FieldOfStudy = dto.FieldOfStudy,
                Location = dto.Location,
                IsOngoing = dto.IsOngoing,
                StartDate = dto.StartDate,
                EndDate = dto.EndDate,
                UserId = userId,
                ResumeId = resumeId,

            };
            
            newEdu.BulletPoints = dto.BulletPoints.Select(bp =>
            {
                var bullet = bp.ToEntity();
                bullet.Education = newEdu;
                return bullet;
            }).ToList();

            return newEdu;
        }).ToList();

        await db.Education.AddRangeAsync(newEducations, cancellationToken);
        await db.SaveChangesAsync(cancellationToken);

        return Response<List<EducationDto>>.Success(newEducations.Select(e => e.ToDto()).ToList());
    }
}