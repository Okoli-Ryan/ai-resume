using System.Net;
using Microsoft.EntityFrameworkCore;
using Resume_builder.Common;
using Resume_builder.Features.BulletPoint.Common;
using Resume_builder.Infrastructure.Persistence.Data;
using Resume_builder.Infrastructure.Services.ClaimService;

namespace Resume_builder.Features.BulletPoint.UpdateByFieldId;

public class UpdateBulletPointsByFieldIdHandler(AppDbContext db, IClaimsService claimsService)
    : IResponseHandler<UpdateBulletPointsByFieldIdCommand, List<BulletPointDto>>
{
    public async Task<Response<List<BulletPointDto>>> Handle(UpdateBulletPointsByFieldIdCommand command,
        CancellationToken cancellationToken)
    {
        var userId = claimsService.GetUserId();

        if (userId is null)
            return Response<List<BulletPointDto>>.Fail(HttpStatusCode.Unauthorized, "Unauthorized");

        // Verify the field entity belongs to user
        var entityExists = await VerifyEntityOwnership(command.FieldType, command.FieldId, userId, cancellationToken);
        
        if (!entityExists)
            return Response<List<BulletPointDto>>.Fail(HttpStatusCode.NotFound, $"{command.FieldType} not found");

        // Delete existing bullet points for this field
        var existingBulletPoints = await GetExistingBulletPoints(command.FieldType, command.FieldId, cancellationToken);
        db.BulletPoint.RemoveRange(existingBulletPoints);

        // Create new bullet points
        var newBulletPoints = command.BulletPoints.Select((bp, index) => CreateBulletPoint(command.FieldType, command.FieldId, bp.Text, index)).ToList();

        db.BulletPoint.AddRange(newBulletPoints);
        await db.SaveChangesAsync(cancellationToken);

        return Response<List<BulletPointDto>>.Success(newBulletPoints.Select(bp => bp.ToDto()).ToList());
    }

    private async Task<bool> VerifyEntityOwnership(FieldType fieldType, string fieldId, string userId, CancellationToken cancellationToken)
    {
        return fieldType switch
        {
            FieldType.Education => await db.Education.AnyAsync(e => e.Id == fieldId && e.UserId == userId, cancellationToken),
            FieldType.Project => await db.Project.AnyAsync(p => p.Id == fieldId && p.UserId == userId, cancellationToken),
            FieldType.WorkExperience => await db.WorkExperience.AnyAsync(we => we.Id == fieldId && we.UserId == userId, cancellationToken),
            _ => false
        };
    }

    private async Task<List<BulletPointEntity>> GetExistingBulletPoints(FieldType fieldType, string fieldId, CancellationToken cancellationToken)
    {
        return fieldType switch
        {
            FieldType.Education => await db.BulletPoint.Where(bp => bp.EducationId == fieldId).ToListAsync(cancellationToken),
            FieldType.Project => await db.BulletPoint.Where(bp => bp.ProjectId == fieldId).ToListAsync(cancellationToken),
            FieldType.WorkExperience => await db.BulletPoint.Where(bp => bp.WorkExperienceId == fieldId).ToListAsync(cancellationToken),
            _ => new List<BulletPointEntity>()
        };
    }

    private BulletPointEntity CreateBulletPoint(FieldType fieldType, string fieldId, string text, int order)
    {
        var bulletPoint = new BulletPointEntity
        {
            Id = Guid.NewGuid().ToString(),
            Text = text,
            Order = order,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        switch (fieldType)
        {
            case FieldType.Education:
                bulletPoint.EducationId = fieldId;
                break;
            case FieldType.Project:
                bulletPoint.ProjectId = fieldId;
                break;
            case FieldType.WorkExperience:
                bulletPoint.WorkExperienceId = fieldId;
                break;
        }

        return bulletPoint;
    }
}