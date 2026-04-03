using System.Net;
using Microsoft.EntityFrameworkCore;
using Resume_builder.Common;
using Resume_builder.Features.FileUpload.Common;
using Resume_builder.Infrastructure.Persistence.Data;
using Resume_builder.Infrastructure.Services.ClaimService;

namespace Resume_builder.Features.FileUpload.GetById;

public class GetFileUploadByIdHandler(AppDbContext db, IClaimsService claimsService)
    : IResponseHandler<GetFileUploadByIdQuery, FileUploadDto>
{
    public async Task<Response<FileUploadDto>> Handle(GetFileUploadByIdQuery query,
        CancellationToken cancellationToken)
    {
        var userId = claimsService.GetUserId();

        if (userId is null)
            return Response<FileUploadDto>.Fail(HttpStatusCode.Unauthorized, "Unauthorized");

        var entity = await db.FileUpload
            .FirstOrDefaultAsync(x => x.Id == query.FileUploadId && x.UserId == userId, cancellationToken);

        if (entity is null)
            return Response<FileUploadDto>.Fail(HttpStatusCode.NotFound, "File upload not found");

        return Response<FileUploadDto>.Success(entity.ToDto());
    }
}
