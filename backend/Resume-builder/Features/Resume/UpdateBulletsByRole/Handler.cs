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

        // First, get all section IDs that belong to this resume
        var workExperienceIds = await db.WorkExperience
            .Where(w => w.ResumeId == command.ResumeId)
            .Select(w => w.Id)
            .ToListAsync(cancellationToken);

        var projectIds = await db.Project
            .Where(p => p.ResumeId == command.ResumeId)
            .Select(p => p.Id)
            .ToListAsync(cancellationToken);

        var educationIds = await db.Education
            .Where(e => e.ResumeId == command.ResumeId)
            .Select(e => e.Id)
            .ToListAsync(cancellationToken);

        var certificationIds = await db.Certification
            .Where(c => c.ResumeId == command.ResumeId)
            .Select(c => c.Id)
            .ToListAsync(cancellationToken);

        // Fetch bullet points that belong to these sections
        var bulletPoints = await db.BulletPoint
            .Where(bp => bulletPointIds.Contains(bp.Id) && (
                (bp.WorkExperienceId != null && workExperienceIds.Contains(bp.WorkExperienceId)) ||
                (bp.ProjectId != null && projectIds.Contains(bp.ProjectId)) ||
                (bp.EducationId != null && educationIds.Contains(bp.EducationId)) ||
                (bp.CertificationId != null && certificationIds.Contains(bp.CertificationId))
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
