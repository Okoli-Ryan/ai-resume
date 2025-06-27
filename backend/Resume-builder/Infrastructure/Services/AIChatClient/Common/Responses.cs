using System.Text.Json.Serialization;

namespace Resume_builder.Infrastructure.Services.AIChatClient.Common;

public class AIResponse<T>
{
    public long? PromptUsage { get; set; }
    public T Response { get; set; }
}

public class ResumeAdditionalInfo
{
    public string? JobDescription { get; set; }
    public string? Tags { get; set; }
}

public class EnhanceWorkExperienceBulletPointsResponse
{
    [JsonPropertyName("bulletPoints")] public List<string> BulletPoints { get; set; } = [];
}

public class GenerateResumeResponse
{
    public string Summary { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string Tags { get; set; } = string.Empty;
    public List<GenerateResumeWorkExperienceResponse> WorkExperience { get; set; }
    public List<GenerateResumeProjectResponse> Projects { get; set; }
    public List<GenerateResumeSkillResponse> Skills { get; set; }
}

public class GenerateResumeSkillResponse
{
    public string Category { get; set; } = string.Empty;
    public string Skills { get; set; } = string.Empty;
}

public class GenerateResumeWorkExperienceResponse
{
    public string Role { get; set; } = string.Empty;
    public string CompanyName { get; set; } = string.Empty;
    public string CompanyLink { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public string WorkType { get; set; } = string.Empty;
    public bool IsOngoing { get; set; }
    public DateTime StartTime { get; set; } = new DateTime();
    public DateTime EndTime { get; set; } = new DateTime();
    public List<string> BulletPoints { get; set; } = [];
}

public class GenerateResumeProjectResponse
{
    public string ProjectName { get; set; } = string.Empty;
    public string ProjectUrl { get; set; } = string.Empty;
    public List<string> BulletPoints { get; set; } = [];
}