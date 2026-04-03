using System.Net;
using Microsoft.EntityFrameworkCore;
using Resume_builder.Common;
using Resume_builder.Infrastructure.Persistence.Data;
using Resume_builder.Infrastructure.Services.ClaimService;

namespace Resume_builder.Features.FileUpload.Delete;

public class DeleteFileUploadHandler(AppDbContext db, IClaimsService claimsService)
    : IResponseHandler<DeleteFileUploadCommand, bool>
{
    public async Task<Response<bool>> Handle(DeleteFileUploadCommand command,
        CancellationToken cancellationToken)
    {
        var userId = claimsService.GetUserId();

        if (userId is null)
            return Response<bool>.Fail(HttpStatusCode.Unauthorized, "Unauthorized");

        var entity = await db.FileUpload
            .FirstOrDefaultAsync(x => x.Id == command.FileUploadId && x.UserId == userId, cancellationToken);

        if (entity is null)
            return Response<bool>.Fail(HttpStatusCode.NotFound, "File upload not found");

        db.FileUpload.Remove(entity);
        await db.SaveChangesAsync(cancellationToken);

        return Response<bool>.Success(true);
    }
}
