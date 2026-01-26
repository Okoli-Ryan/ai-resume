namespace Resume_builder.Features.BulletPoint.UpdateByFieldId;

public enum FieldType
{
    Education,
    Project,
    WorkExperience
}

public record UpdateBulletPointsByFieldIdCommand(FieldType FieldType, string FieldId, List<BulletPointTextItem> BulletPoints);

public class UpdateBulletPointsByFieldIdRequest
{
    public List<BulletPointTextItem> BulletPoints { get; set; } = new();
}

public class BulletPointTextItem
{
    public string Text { get; set; } = string.Empty;
}