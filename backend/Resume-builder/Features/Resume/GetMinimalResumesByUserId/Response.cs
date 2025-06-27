namespace Resume_builder.Features.Resume.GetMinimalResumesByUserId;

public class MinimalResumeResponse
{
    public string Id { get; set; }
    public string ResumeName { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public bool IsFavourite { get; set; }
    public string Tags { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}