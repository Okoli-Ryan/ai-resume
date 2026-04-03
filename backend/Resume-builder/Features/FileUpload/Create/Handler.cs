using System.Net;
using Resume_builder.Common;
using Resume_builder.Features.FileUpload.Common;
using Resume_builder.Infrastructure.Persistence.Data;
using Resume_builder.Infrastructure.Services.ClaimService;

namespace Resume_builder.Features.FileUpload.Create;

public class CreateFileUploadHandler(AppDbContext db, IClaimsService claimsService)
    : IResponseHandler<CreateFileUploadCommand, FileUploadDto>
{
    public async Task<Response<FileUploadDto>> Handle(CreateFileUploadCommand request,
        CancellationToken cancellationToken)
    {
        var userId = claimsService.GetUserId();

        if (userId is null)
            return Response<FileUploadDto>.Fail(HttpStatusCode.Unauthorized, "Unauthorized");

        var entity = new FileUploadEntity
        {
            ResumeId = request.ResumeId,
            CoverLetterId = request.CoverLetterId,
            Version = request.Version,
            Url = request.Url,
            UserId = userId
        };

        db.FileUpload.Add(entity);
        await db.SaveChangesAsync(cancellationToken);

        return Response<FileUploadDto>.Success(entity.ToDto());
    }
}
