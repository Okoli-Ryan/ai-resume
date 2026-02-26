namespace Resume_builder.Features.Link.PatchUpdate;

public record PatchUpdateLinkCommand(string LinkId, PatchUpdateLinkRequest Request);

public class PatchUpdateLinkRequest
{
    public string? Name { get; set; }
    public string? Url { get; set; }
    public int? Index { get; set; }
}
