using System.Net;
using Microsoft.EntityFrameworkCore;
using Resume_builder.Common;
using Resume_builder.Features.Resume.Common;
using Resume_builder.Infrastructure.Persistence.Data;
using Resume_builder.Infrastructure.Services.ClaimService;
using Resume_builder.Utils;

namespace Resume_builder.Features.Resume.Patch;

public class PatchResumeHandler(
    AppDbContext db,
    IClaimsService claimsService) : IResponseHandler<PatchResumeCommand, ResumeDto>
{
    public async Task<Response<ResumeDto>> Handle(PatchResumeCommand command, CancellationToken cancellationToken)
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

        // Apply patches only for provided fields using helper
        resume.ResumeName = PatchHelper.ApplyPatch(resume.ResumeName, request.ResumeName);
        resume.UserFullName = PatchHelper.ApplyPatch(resume.UserFullName, request.UserName);
        resume.UserEmail = PatchHelper.ApplyPatch(resume.UserEmail, request.Email);
        resume.TextSummary = PatchHelper.ApplyPatch(resume.TextSummary, request.Summary);
        resume.Tags = PatchHelper.ApplyPatch(resume.Tags, request.Tags);
        resume.JobRole = PatchHelper.ApplyPatch(resume.JobRole, request.Role);
        resume.UserAddress = PatchHelper.ApplyPatch(resume.UserAddress, request.Address);
        resume.UserPhoneNumber = PatchHelper.ApplyPatch(resume.UserPhoneNumber, request.PhoneNumber);
        resume.Order = PatchHelper.ApplyPatch(resume.Order, request.Order);
        resume.LinkedinUrl = PatchHelper.ApplyPatch(resume.LinkedinUrl, request.LinkedinUrl);
        resume.GithubUrl = PatchHelper.ApplyPatch(resume.GithubUrl, request.GithubUrl);
        resume.PortfolioUrl = PatchHelper.ApplyPatch(resume.PortfolioUrl, request.PortfolioUrl);
        
        // Handle bool separately as it's a value type
        if (request.IsFavourite.HasValue)
            resume.IsFavourite = request.IsFavourite.Value;

        db.Resume.Update(resume);
        await db.SaveChangesAsync(cancellationToken);

        return Response<ResumeDto>.Success(resume.ToDto());
    }
}
