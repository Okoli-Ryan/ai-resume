using System.Net;
using Microsoft.EntityFrameworkCore;
using Resume_builder.Common;
using Resume_builder.Features.FileUpload.Common;
using Resume_builder.Infrastructure.Persistence.Data;
using Resume_builder.Infrastructure.Services.ClaimService;
using Resume_builder.Infrastructure.Services.FileStorageService;

namespace Resume_builder.Features.FileUpload.UploadFile;

public class UploadFileHandler(
    AppDbContext db,
    IClaimsService claimsService,
    IFileStorageService fileStorageService)
    : IResponseHandler<UploadFileCommand, FileUploadDto>
{
    public async Task<Response<FileUploadDto>> Handle(UploadFileCommand command, CancellationToken cancellationToken)
    {
        var userId = claimsService.GetUserId();

        if (userId is null)
            return Response<FileUploadDto>.Fail(HttpStatusCode.Unauthorized, "Unauthorized");

        var result = await fileStorageService.UploadAsync(command.File, cancellationToken);

        if (result is null)
            return Response<FileUploadDto>.Fail(HttpStatusCode.InternalServerError, "File upload failed");

        var version = 0;
        if (command.ResumeId is not null)
            version = await db.Resume
                .Where(r => r.Id == command.ResumeId)
                .Select(r => r.Version)
                .FirstOrDefaultAsync(cancellationToken);

        var entity = new FileUploadEntity
        {
            Url = result.Url,
            FileKey = result.Key,
            ResumeId = command.ResumeId,
            CoverLetterId = command.CoverLetterId,
            UserId = userId,
            Version = version
        };

        db.FileUpload.Add(entity);
        await db.SaveChangesAsync(cancellationToken);

        return Response<FileUploadDto>.Success(entity.ToDto());
    }
}
