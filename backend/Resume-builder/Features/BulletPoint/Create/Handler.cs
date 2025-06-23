using Resume_builder.Common;
using Resume_builder.Features.BulletPoint.Common;
using Resume_builder.Infrastructure.Persistence.Data;

namespace Resume_builder.Features.BulletPoint.Create;

public class CreateBulletPointHandler(AppDbContext db)
    : IResponseHandler<List<CreateBulletPointsCommand>, List<string>>
{
    public async Task<Response<List<string>>> Handle(List<CreateBulletPointsCommand> request,
        CancellationToken cancellationToken)
    {
        var bulletPoints = request.Select(x => x.ToEntity()).ToList();

        db.BulletPoint.AddRange(bulletPoints);
        await db.SaveChangesAsync(cancellationToken);

        return Response<List<string>>.Success(bulletPoints.Select(x => x.Text).ToList());
    }
}