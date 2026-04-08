using System.Net;
using Microsoft.EntityFrameworkCore;
using Resume_builder.Common;
using Resume_builder.Features.FileUpload.Common;
using Resume_builder.Infrastructure.Persistence.Data;
using Resume_builder.Infrastructure.Services.ClaimService;

namespace Resume_builder.Features.FileUpload.GetByUserId;

public class GetFileUploadsByUserIdHandler(AppDbContext db, IClaimsService claimsService)
    : IResponseHandler<GetFileUploadsByUserIdQuery, List<FileUploadDto>>
{
    public async Task<Response<List<FileUploadDto>>> Handle(GetFileUploadsByUserIdQuery query,
        CancellationToken cancellationToken)
    {
        var userId = claimsService.GetUserId();

        if (userId is null)
            return Response<List<FileUploadDto>>.Fail(HttpStatusCode.Unauthorized, "Unauthorized");

        var entities = await db.FileUpload
            .Where(x => x.UserId == userId)
            .ToListAsync(cancellationToken);

        return Response<List<FileUploadDto>>.Success(entities.Select(x => x.ToDto()).ToList());
    }
}
