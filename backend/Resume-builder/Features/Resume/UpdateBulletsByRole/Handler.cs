using System.Net;
using Microsoft.EntityFrameworkCore;
using Resume_builder.Common;
using Resume_builder.Features.BulletPoint.Common;
using Resume_builder.Infrastructure.Persistence.Data;
using Resume_builder.Infrastructure.Services.ClaimService;

namespace Resume_builder.Features.Resume.UpdateBulletsByRole;

public class UpdateBulletsByRoleHandler(
    AppDbContext db,
    IClaimsService claimsService) : IResponseHandler<UpdateBulletsByRoleCommand, UpdateBulletsByRoleResponse>
{
    public async Task<Response<UpdateBulletsByRoleResponse>> Handle(UpdateBulletsByRoleCommand command, CancellationToken cancellationToken)
    {
        var request = command.Request;
        var userId = claimsService.GetUserId();

        if (userId is null)
            return Response<UpdateBulletsByRoleResponse>.Fail(HttpStatusCode.Unauthorized, "Unauthorized");

        // Verify resume exists and belongs to user
        var resume = await db.Resume
            .Where(x => x.UserId == userId && x.Id == command.ResumeId)
            .FirstOrDefaultAsync(cancellationToken);

        if (resume == null)
            return Response<UpdateBulletsByRoleResponse>.Fail(HttpStatusCode.NotFound, "Resume not found");

        // Get all bullet point IDs to update
        var bulletPointIds = request.BulletPoints.Select(bp => bp.BulletPointId).ToList();

        // Fetch bullet points and verify they belong to this resume's sections
        var bulletPoints = await db.BulletPoint
            .Where(bp => bulletPointIds.Contains(bp.Id) && (
                (bp.WorkExperienceId != null && db.WorkExperience.Any(w => w.Id == bp.WorkExperienceId && w.ResumeId == command.ResumeId)) ||
                (bp.ProjectId != null && db.Project.Any(p => p.Id == bp.ProjectId && p.ResumeId == command.ResumeId)) ||
                (bp.EducationId != null && db.Education.Any(e => e.Id == bp.EducationId && e.ResumeId == command.ResumeId)) ||
                (bp.CertificationId != null && db.Certification.Any(c => c.Id == bp.CertificationId && c.ResumeId == command.ResumeId))
            ))
            .ToListAsync(cancellationToken);

        if (bulletPoints.Count != request.BulletPoints.Count)
            return Response<UpdateBulletsByRoleResponse>.Fail(HttpStatusCode.BadRequest, 
                "Some bullet points were not found or do not belong to this resume");

        var updatedBulletPoints = new List<BulletPointDto>();

        // Update each bullet point
        foreach (var update in request.BulletPoints)
        {
            var bulletPoint = bulletPoints.FirstOrDefault(bp => bp.Id == update.BulletPointId);
            if (bulletPoint != null)
            {
                bulletPoint.Text = update.Text;
                db.BulletPoint.Update(bulletPoint);
                updatedBulletPoints.Add(bulletPoint.ToDto());
            }
        }

        await db.SaveChangesAsync(cancellationToken);

        var response = new UpdateBulletsByRoleResponse
        {
            ResumeId = command.ResumeId,
            TargetRole = request.TargetRole,
            UpdatedBulletPoints = updatedBulletPoints,
            TotalUpdated = updatedBulletPoints.Count
        };

        return Response<UpdateBulletsByRoleResponse>.Success(response);
    }
}
