using System.Net;
using Microsoft.EntityFrameworkCore;
using Resume_builder.Common;
using Resume_builder.Features.FileUpload.Common;
using Resume_builder.Infrastructure.Persistence.Data;
using Resume_builder.Infrastructure.Services.ClaimService;

namespace Resume_builder.Features.FileUpload.GetByResumeId;

public class GetFileUploadsByResumeIdHandler(AppDbContext db, IClaimsService claimsService)
    : IResponseHandler<GetFileUploadsByResumeIdQuery, List<FileUploadDto>>
{
    public async Task<Response<List<FileUploadDto>>> Handle(GetFileUploadsByResumeIdQuery query,
        CancellationToken cancellationToken)
    {
        var userId = claimsService.GetUserId();

        if (userId is null)
            return Response<List<FileUploadDto>>.Fail(HttpStatusCode.Unauthorized, "Unauthorized");

        var entities = await db.FileUpload
            .Where(x => x.ResumeId == query.ResumeId && x.UserId == userId)
            .ToListAsync(cancellationToken);

        return Response<List<FileUploadDto>>.Success(entities.Select(x => x.ToDto()).ToList());
    }
}
