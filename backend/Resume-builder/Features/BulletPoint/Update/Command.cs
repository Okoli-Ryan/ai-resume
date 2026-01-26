using Resume_builder.Features.BulletPoint.Common;

namespace Resume_builder.Features.BulletPoint.Update;

public record UpdateBulletPointCommand(string BulletPointId, UpdateBulletPointRequest Request);

public class UpdateBulletPointRequest
{
    public string Text { get; set; } = string.Empty;
}