using System.Net;
using Microsoft.EntityFrameworkCore;
using Resume_builder.Common;
using Resume_builder.Features.Education.Common;
using Resume_builder.Infrastructure.Persistence.Data;
using Resume_builder.Infrastructure.Services.ClaimService;
using Resume_builder.Utils;

namespace Resume_builder.Features.Education.PatchUpdate;

public class PatchUpdateEducationHandler(
    AppDbContext db,
    IClaimsService claimsService) : IResponseHandler<PatchUpdateEducationCommand, EducationDto>
{
    /// <summary>
    ///     Property mappings from request properties to entity properties
    /// </summary>
    private static readonly Dictionary<string, string> PropertyMappings = new()
    {
        { nameof(PatchUpdateEducationRequest.SchoolName), nameof(EducationEntity.SchoolName) },
        { nameof(PatchUpdateEducationRequest.Degree), nameof(EducationEntity.Degree) },
        { nameof(PatchUpdateEducationRequest.FieldOfStudy), nameof(EducationEntity.FieldOfStudy) },
        { nameof(PatchUpdateEducationRequest.Location), nameof(EducationEntity.Location) },
        { nameof(PatchUpdateEducationRequest.IsOngoing), nameof(EducationEntity.IsOngoing) },
        { nameof(PatchUpdateEducationRequest.StartDate), nameof(EducationEntity.StartDate) },
        { nameof(PatchUpdateEducationRequest.EndDate), nameof(EducationEntity.EndDate) },
    };

    public async Task<Response<EducationDto>> Handle(PatchUpdateEducationCommand command, CancellationToken cancellationToken)
    {
        var request = command.Request;

        var userId = claimsService.GetUserId();

        if (userId is null)
            return Response<EducationDto>.Fail(HttpStatusCode.Unauthorized, "Unauthorized");

        var education = await db.Education
            .Where(x => x.UserId == userId && x.Id == command.EducationId)
            .FirstOrDefaultAsync(cancellationToken);

        if (education == null)
            return Response<EducationDto>.Fail(HttpStatusCode.NotFound, "Education not found");

        // Apply patch update using the helper
        var hasUpdates = PatchUpdateHelper.ApplyPatch(request, education, PropertyMappings);

        // Custom logic: if EndDate is present in the request, set IsOngoing accordingly
        if (request.EndDate != null)
        {
            education.IsOngoing = false;
            hasUpdates = true;
        }
        else if (request.EndDate == null && request.EndDate != education.EndDate)
        {
            education.IsOngoing = true;
            hasUpdates = true;
        }

        if (hasUpdates)
        {
            db.Education.Update(education);
            await db.SaveChangesAsync(cancellationToken);
        }

        return Response<EducationDto>.Success(education.ToDto());
    }
}
