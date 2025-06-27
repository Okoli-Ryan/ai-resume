using System.Net;
using Microsoft.EntityFrameworkCore;
using Resume_builder.Common;
using Resume_builder.Infrastructure.Persistence.Data;
using Resume_builder.Infrastructure.Services.ClaimService;

namespace Resume_builder.Features.Resume.GetMinimalResumesByUserId;

public class GetMinimalResumesByUserIdHandler(AppDbContext db, IClaimsService claimsService)
{
    public async Task<Response<List<MinimalResumeResponse>>> Handle(string requestUserId,
        CancellationToken cancellationToken)
    {
        var userId = claimsService.GetUserId();

        if (userId is null || userId != requestUserId)
            return Response<List<MinimalResumeResponse>>.Fail(HttpStatusCode.Unauthorized, "Unauthorized");

        var resumes = await db.Resume
            .Where(x => x.UserId == userId)
            .OrderByDescending(x => x.IsFavourite)
            .ThenByDescending(x => x.UpdatedAt)
            .Select(x => new MinimalResumeResponse
            {
                Id = x.Id,
                ResumeName = x.ResumeName ?? string.Empty,
                Role = x.JobRole ?? string.Empty,
                IsFavourite = x.IsFavourite,
                Tags = x.Tags ?? string.Empty,
                CreatedAt = x.CreatedAt,
                UpdatedAt = x.UpdatedAt
            })
            .ToListAsync(cancellationToken);

        return Response<List<MinimalResumeResponse>>.Success(resumes);
    }
}