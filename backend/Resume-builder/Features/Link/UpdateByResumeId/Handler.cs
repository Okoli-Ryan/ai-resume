using System.Net;
using Microsoft.EntityFrameworkCore;
using Resume_builder.Common;
using Resume_builder.Features.Link.Common;
using Resume_builder.Infrastructure.Persistence.Data;
using Resume_builder.Infrastructure.Services.ClaimService;

namespace Resume_builder.Features.Link.UpdateByResumeId;

public class UpdateLinksByResumeIdHandler(AppDbContext db, IClaimsService claimsService)
    : IResponseHandler<UpdateLinksByResumeIdCommand, List<LinkDto>>
{
    public async Task<Response<List<LinkDto>>> Handle(UpdateLinksByResumeIdCommand command,
        CancellationToken cancellationToken)
    {
        var request = command.Links;
        var resumeId = command.ResumeId;

        var userId = claimsService.GetUserId();

        if (userId is null)
            return Response<List<LinkDto>>.Fail(HttpStatusCode.Unauthorized, "Unauthorized");

        var existingLinks = await db.Link
            .Where(x => x.ResumeId == resumeId && x.UserId == userId)
            .ToListAsync(cancellationToken);

        db.Link.RemoveRange(existingLinks);

        // Add new links from the request
        var newLinks = request.Select(dto =>
        {
            var newLink = new LinkEntity
            {
                LinkName = dto.LinkName,
                Url = dto.Url,
                Index = dto.Index,
                UserId = userId,
                ResumeId = resumeId
            };

            return newLink;
        }).ToList();

        await db.Link.AddRangeAsync(newLinks, cancellationToken);
        await db.SaveChangesAsync(cancellationToken);

        return Response<List<LinkDto>>.Success(newLinks.Select(link => link.ToDto()).ToList());
    }
}