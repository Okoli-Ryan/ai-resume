using System.Net;
using Microsoft.EntityFrameworkCore;
using Resume_builder.Common;
using Resume_builder.Features.FileUpload.Common;
using Resume_builder.Infrastructure.Persistence.Data;
using Resume_builder.Infrastructure.Services.ClaimService;

namespace Resume_builder.Features.FileUpload.Update;

public class UpdateFileUploadHandler(AppDbContext db, IClaimsService claimsService)
    : IResponseHandler<UpdateFileUploadCommand, FileUploadDto>
{
    public async Task<Response<FileUploadDto>> Handle(UpdateFileUploadCommand command,
        CancellationToken cancellationToken)
    {
        var userId = claimsService.GetUserId();

        if (userId is null)
            return Response<FileUploadDto>.Fail(HttpStatusCode.Unauthorized, "Unauthorized");

        var entity = await db.FileUpload
            .FirstOrDefaultAsync(x => x.Id == command.FileUploadId && x.UserId == userId, cancellationToken);

        if (entity is null)
            return Response<FileUploadDto>.Fail(HttpStatusCode.NotFound, "File upload not found");

        var request = command.Request;
        entity.ResumeId = request.ResumeId;
        entity.CoverLetterId = request.CoverLetterId;
        entity.Version = request.Version;
        entity.Url = request.Url;

        db.FileUpload.Update(entity);
        await db.SaveChangesAsync(cancellationToken);

        return Response<FileUploadDto>.Success(entity.ToDto());
    }
}
