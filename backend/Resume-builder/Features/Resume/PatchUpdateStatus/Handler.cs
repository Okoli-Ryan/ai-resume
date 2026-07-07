using System.Net;
using Microsoft.EntityFrameworkCore;
using Resume_builder.Common;
using Resume_builder.Features.Resume.Common;
using Resume_builder.Infrastructure.Persistence.Data;
using Resume_builder.Infrastructure.Services.ClaimService;

namespace Resume_builder.Features.Resume.PatchUpdateStatus;

public class PatchUpdateResumeStatusHandler(
    AppDbContext db,
    IClaimsService claimsService) : IResponseHandler<PatchUpdateResumeStatusCommand, ResumeDto>
{
    public async Task<Response<ResumeDto>> Handle(PatchUpdateResumeStatusCommand command, CancellationToken cancellationToken)
    {
        var userId = claimsService.GetUserId();

        if (userId is null)
            return Response<ResumeDto>.Fail(HttpStatusCode.Unauthorized, "Unauthorized");

        var resume = await db.Resume
            .Where(x => x.UserId == userId && x.Id == command.ResumeId)
            .FirstOrDefaultAsync(cancellationToken);

        if (resume == null)
            return Response<ResumeDto>.Fail(HttpStatusCode.NotFound, "Resume not found");

        if (command.Status != "Draft" && command.Status != "Published")
            return Response<ResumeDto>.Fail(HttpStatusCode.BadRequest, "Status must be 'Draft' or 'Published'");

        resume.Status = command.Status;
        db.Resume.Update(resume);
        await db.SaveChangesAsync(cancellationToken);

        return Response<ResumeDto>.Success(resume.ToDto());
    }
}
