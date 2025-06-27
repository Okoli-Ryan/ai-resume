namespace Resume_builder.Features.BulletPoint.Enhance;

public record EnhanceBulletPointCommand(string BulletPointId, EnhanceBulletPointAdditionalInfo AdditionalInfo);

public class EnhanceBulletPointAdditionalInfo
{
    public string? Role { get; set; }
    public string? Tags { get; set; }
}