using System.Net;
using Microsoft.EntityFrameworkCore;
using Resume_builder.Common;
using Resume_builder.Infrastructure.Persistence.Data;
using Resume_builder.Infrastructure.Services.ClaimService;

namespace Resume_builder.Features.Resume.GetMinimalResumesByUserId;

public class GetMinimalResumesByUserIdHandler(AppDbContext db, IClaimsService claimsService)
{
    public async Task<Response<List<MinimalResumeResponse>>> Handle(
        string? resumeName,
        string? tags,
        DateTime? dateFrom,
        DateTime? dateTo,
        bool? isFavourite,
        CancellationToken cancellationToken)
    {
        var userId = claimsService.GetUserId();

        if (userId is null)
            return Response<List<MinimalResumeResponse>>.Fail(HttpStatusCode.Unauthorized, "Unauthorized");

        var query = db.Resume.Where(x => x.UserId == userId);

        if (isFavourite == true)
            query = query.Where(x => x.IsFavourite);

        if (dateFrom.HasValue)
            query = query.Where(x => x.CreatedAt >= dateFrom.Value);

        if (dateTo.HasValue)
            query = query.Where(x => x.CreatedAt <= dateTo.Value);

        var resumes = await query
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

        if (!string.IsNullOrWhiteSpace(resumeName))
            resumes = resumes
                .Where(r => r.ResumeName.Contains(resumeName, StringComparison.OrdinalIgnoreCase))
                .ToList();

        if (!string.IsNullOrWhiteSpace(tags))
        {
            var tagList = tags.Split(',')
                .Select(t => t.Trim())
                .Where(t => t.Length > 0)
                .ToList();

            resumes = resumes
                .Where(r => tagList.Any(st =>
                    (r.Tags ?? string.Empty).Contains(st, StringComparison.OrdinalIgnoreCase)))
                .ToList();
        }

        return Response<List<MinimalResumeResponse>>.Success(resumes);
    }
}