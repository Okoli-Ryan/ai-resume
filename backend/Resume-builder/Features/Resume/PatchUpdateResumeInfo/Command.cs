namespace Resume_builder.Features.Resume.PatchUpdateResumeInfo;

public record PatchUpdateResumeInfoCommand(string ResumeId, PatchUpdateResumeInfoRequest Request);

public class PatchUpdateResumeInfoRequest
{
    public string? UserName { get; set; }
    public string? ResumeName { get; set; }
    public string? Email { get; set; }
    public string? Role { get; set; }
    public string? Address { get; set; }
    public string? PhoneNumber { get; set; }
}
