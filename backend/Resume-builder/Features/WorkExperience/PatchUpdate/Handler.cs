using System.Net;
using Microsoft.EntityFrameworkCore;
using Resume_builder.Common;
using Resume_builder.Features.WorkExperience.Common;
using Resume_builder.Infrastructure.Persistence.Data;
using Resume_builder.Infrastructure.Services.ClaimService;
using Resume_builder.Utils;

namespace Resume_builder.Features.WorkExperience.PatchUpdate;

public class PatchUpdateWorkExperienceHandler(
    AppDbContext db,
    IClaimsService claimsService) : IResponseHandler<PatchUpdateWorkExperienceCommand, WorkExperienceDto>
{
    /// <summary>
    ///     Property mappings from request properties to entity properties
    /// </summary>
    private static readonly Dictionary<string, string> PropertyMappings = new()
    {
        { nameof(PatchUpdateWorkExperienceRequest.CompanyName), nameof(WorkExperienceEntity.CompanyName) },
        { nameof(PatchUpdateWorkExperienceRequest.CompanyLink), nameof(WorkExperienceEntity.CompanyLink) },
        { nameof(PatchUpdateWorkExperienceRequest.Title), nameof(WorkExperienceEntity.Title) },
        { nameof(PatchUpdateWorkExperienceRequest.WorkType), nameof(WorkExperienceEntity.WorkType) },
        { nameof(PatchUpdateWorkExperienceRequest.StartDate), nameof(WorkExperienceEntity.StartDate) },
        { nameof(PatchUpdateWorkExperienceRequest.EndDate), nameof(WorkExperienceEntity.EndDate) },
        { nameof(PatchUpdateWorkExperienceRequest.Location), nameof(WorkExperienceEntity.Location) },
    };

    public async Task<Response<WorkExperienceDto>> Handle(PatchUpdateWorkExperienceCommand command, CancellationToken cancellationToken)
    {
        var request = command.Request;

        var userId = claimsService.GetUserId();

        if (userId is null)
            return Response<WorkExperienceDto>.Fail(HttpStatusCode.Unauthorized, "Unauthorized");

        var workExperience = await db.WorkExperience
            .Where(x => x.UserId == userId && x.Id == command.WorkExperienceId)
            .FirstOrDefaultAsync(cancellationToken);

        if (workExperience == null)
            return Response<WorkExperienceDto>.Fail(HttpStatusCode.NotFound, "Work experience not found");

        // Apply patch update using the helper
        var hasUpdates = PatchUpdateHelper.ApplyPatch(request, workExperience, PropertyMappings);

        if (hasUpdates)
        {
            db.WorkExperience.Update(workExperience);
            await db.SaveChangesAsync(cancellationToken);
        }

        return Response<WorkExperienceDto>.Success(workExperience.ToDto());
    }
}
