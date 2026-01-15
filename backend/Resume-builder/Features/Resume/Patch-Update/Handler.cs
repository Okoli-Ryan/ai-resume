using System.Net;
using Microsoft.EntityFrameworkCore;
using Resume_builder.Common;
using Resume_builder.Features.Resume.Common;
using Resume_builder.Infrastructure.Persistence.Data;
using Resume_builder.Infrastructure.Services.ClaimService;
using Resume_builder.Utils;

namespace Resume_builder.Features.Resume.PatchUpdate;

public class PatchUpdateResumeHandler(
    AppDbContext db,
    IClaimsService claimsService) : IResponseHandler<PatchUpdateResumeCommand, ResumeDto>
{
    /// <summary>
    ///     Property mappings from request properties to entity properties
    /// </summary>
    private static readonly Dictionary<string, string> PropertyMappings = new()
    {
        { nameof(PatchUpdateResumeRequest.ResumeName), nameof(ResumeEntity.ResumeName) },
        { nameof(PatchUpdateResumeRequest.UserName), nameof(ResumeEntity.UserFullName) },
        { nameof(PatchUpdateResumeRequest.Email), nameof(ResumeEntity.UserEmail) },
        { nameof(PatchUpdateResumeRequest.Summary), nameof(ResumeEntity.TextSummary) },
        { nameof(PatchUpdateResumeRequest.Role), nameof(ResumeEntity.JobRole) },
        { nameof(PatchUpdateResumeRequest.Address), nameof(ResumeEntity.UserAddress) },
        { nameof(PatchUpdateResumeRequest.PhoneNumber), nameof(ResumeEntity.UserPhoneNumber) },
        { nameof(PatchUpdateResumeRequest.Tags), nameof(ResumeEntity.Tags) },
        { nameof(PatchUpdateResumeRequest.Order), nameof(ResumeEntity.Order) },
        { nameof(PatchUpdateResumeRequest.LinkedinUrl), nameof(ResumeEntity.LinkedinUrl) },
        { nameof(PatchUpdateResumeRequest.GithubUrl), nameof(ResumeEntity.GithubUrl) },
        { nameof(PatchUpdateResumeRequest.PortfolioUrl), nameof(ResumeEntity.PortfolioUrl) },
        { nameof(PatchUpdateResumeRequest.IsFavourite), nameof(ResumeEntity.IsFavourite) }
    };

    public async Task<Response<ResumeDto>> Handle(PatchUpdateResumeCommand command, CancellationToken cancellationToken)
    {
        var request = command.Request;

        var userId = claimsService.GetUserId();

        if (userId is null)
            return Response<ResumeDto>.Fail(HttpStatusCode.Unauthorized, "Unauthorized");

        var resume = await db.Resume
            .Where(x => x.UserId == userId && x.Id == command.ResumeId)
            .FirstOrDefaultAsync(cancellationToken);

        if (resume == null)
            return Response<ResumeDto>.Fail(HttpStatusCode.NotFound, "Resume not found");

        // Apply patch update using the helper
        var hasUpdates = PatchUpdateHelper.ApplyPatch(request, resume, PropertyMappings);

        if (hasUpdates)
        {
            db.Resume.Update(resume);
            await db.SaveChangesAsync(cancellationToken);
        }

        return Response<ResumeDto>.Success(resume.ToDto());
    }
}
