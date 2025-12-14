using System.Net;
using Resume_builder.Common;
using Resume_builder.Features.Link.Common;
using Resume_builder.Infrastructure.Persistence.Data;
using Resume_builder.Infrastructure.Services.ClaimService;

namespace Resume_builder.Features.Link.Create;

public class CreateLinkHandler(AppDbContext db, IClaimsService claimsService)
    : IResponseHandler<CreateLinkCommand, LinkDto>
{
    public async Task<Response<LinkDto>> Handle(CreateLinkCommand request,
        CancellationToken cancellationToken)
    {
        var userId = claimsService.GetUserId();

        if (userId is null)
            return Response<LinkDto>.Fail(HttpStatusCode.Unauthorized, "Unauthorized");

        var link = new LinkEntity
        {
            LinkName = request.LinkName,
            Url = request.Url,
            ResumeId = request.ResumeId,
            UserId = userId
        };

        db.Link.Add(link);
        await db.SaveChangesAsync(cancellationToken);

        return Response<LinkDto>.Success(link.ToDto());
    }
}
