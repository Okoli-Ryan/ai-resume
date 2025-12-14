namespace Resume_builder.Features.Link.Update;

public record UpdateLinkCommand(string LinkId, UpdateLinkRequest Request);

public class UpdateLinkRequest
{
    public string LinkName { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
}
