using System.Net;
using Microsoft.EntityFrameworkCore;
using Resume_builder.Common;
using Resume_builder.Features.BulletPoint.Common;
using Resume_builder.Infrastructure.Persistence.Data;
using Resume_builder.Infrastructure.Services.AIChatClient;
using Resume_builder.Infrastructure.Services.AIChatClient.Common;
using Resume_builder.Infrastructure.Services.ClaimService;

namespace Resume_builder.Features.BulletPoint.Enhance;

public class EnhanceBulletPointHandler(IAIChatClient chatClient, AppDbContext db, IClaimsService claimsService)
    : IResponseHandler<EnhanceBulletPointCommand, BulletPointDto>
{
    public async Task<Response<BulletPointDto>> Handle(EnhanceBulletPointCommand command,
        CancellationToken cancellationToken)
    {
        var userId = claimsService.GetUserId();

        if (userId is null)
            return Response<BulletPointDto>.Fail(HttpStatusCode.Unauthorized, "Unauthorized");

        var existingBulletPoint = await db.BulletPoint
            .Where(x => x.Id == command.BulletPointId)
            .FirstOrDefaultAsync(cancellationToken);

        if (existingBulletPoint is null)
            return Response<BulletPointDto>.Fail(HttpStatusCode.NotFound, "BulletPoint not found");

        var request = new EnhanceBulletPointRequest
        {
            BulletPoint = existingBulletPoint.Text,
            Role = command.AdditionalInfo.Role,
            Tags = command.AdditionalInfo.Tags
        };

        var newBulletPoint = await chatClient.EnhanceBulletPoint(request, cancellationToken);

        existingBulletPoint.Text = newBulletPoint.Response;
        db.Update(existingBulletPoint);

        await db.SaveChangesAsync(cancellationToken);

        return Response<BulletPointDto>.Success(existingBulletPoint.ToDto());
    }
}