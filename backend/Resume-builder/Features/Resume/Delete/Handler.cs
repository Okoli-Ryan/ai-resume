using System.Net;
using Microsoft.EntityFrameworkCore;
using Resume_builder.Common;
using Resume_builder.Infrastructure.Persistence.Data;
using Resume_builder.Infrastructure.Services.ClaimService;

namespace Resume_builder.Features.Resume.Delete;

public class DeleteResumeHandler(AppDbContext db, IClaimsService claimsService)
    : IResponseHandler<DeleteResumeCommand, bool>
{
    public async Task<Response<bool>> Handle(DeleteResumeCommand command, CancellationToken cancellationToken)
    {
        var userId = claimsService.GetUserId();

        if (userId is null)
            return Response<bool>.Fail(HttpStatusCode.Unauthorized, "Unauthorized");

        var resume = await db.Resume
            .FirstOrDefaultAsync(x => x.Id == command.ResumeId && x.UserId == userId, cancellationToken);

        if (resume is null)
            return Response<bool>.Fail(HttpStatusCode.NotFound, "Resume not found");

        db.Resume.Remove(resume);
        await db.SaveChangesAsync(cancellationToken);

        return Response<bool>.Success(true);
    }
}
