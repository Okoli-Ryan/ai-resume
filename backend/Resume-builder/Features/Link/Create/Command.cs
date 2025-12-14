namespace Resume_builder.Features.Link.Create;

public class CreateLinkCommand
{
    public string LinkName { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
    public required string ResumeId { get; set; }
}
