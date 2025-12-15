using Resume_builder.Common;

namespace Resume_builder.Features.Link;

public class LinkEntity : BaseEntity
{
    public string LinkName { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
    public int Index { get; set; }
    public required string ResumeId { get; set; }
    public required string UserId { get; set; }
}