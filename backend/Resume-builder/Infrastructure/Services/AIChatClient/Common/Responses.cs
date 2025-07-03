using System.ComponentModel;
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
    public string? Role { get; set; }
    public string? Tags { get; set; }
}

public class EnhanceBulletPointsResponse
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
    public DateTime StartTime { get; set; } = new();
    public DateTime EndTime { get; set; } = new();
    public List<string> BulletPoints { get; set; } = [];
}

public class GenerateResumeProjectResponse
{
    public string ProjectName { get; set; } = string.Empty;
    public string ProjectUrl { get; set; } = string.Empty;
    public List<string> BulletPoints { get; set; } = [];
}

public class EnhanceSummaryResponse
{
    public string Summary { get; set; } = string.Empty;
}

public class EnhanceSkillsResponse
{
    public string Category { get; set; } = string.Empty;
    public List<string> Skills { get; set; } = [];
}

public class ParsedResumeResponse
{
    public string? UserFullName { get; set; } = string.Empty;

    public string? UserEmail { get; set; } = string.Empty;

    public string? TextSummary { get; set; } = string.Empty;

    public string? JobRole { get; set; } = string.Empty;


    public string? UserAddress { get; set; } = string.Empty;

    public string? UserPhoneNumber { get; set; }

    public string? LinkedinUrl { get; set; }

    public string? GithubUrl { get; set; }

    public string? PortfolioUrl { get; set; }

    [Description(
        "generate a list of tags describing the kind of jobs the resume can be used eg frontend, backend, leadership, fintech, AI, etc")]
    public List<string> Tags { get; set; } = [];

    public virtual List<ParsedResumeProject> Projects { get; set; } = [];
    public virtual List<ParsedResumeEducation>? Education { get; set; }
    public virtual List<ParsedResumeWorkExperience>? WorkExperience { get; set; } = [];
    public virtual List<ParsedResumeSkill>? Skills { get; set; } = [];
}

public class ParsedResumeProject
{
    public string? ProjectName { get; set; } = string.Empty;

    public string? ProjectUrl { get; set; } = string.Empty;

    [Description("The list of tasks (is specified) that was done to achieve the project")]
    public List<string> BulletPoints { get; set; } = [];
}

public class ParsedResumeEducation
{
    public string? SchoolName { get; set; }

    public string? Degree { get; set; }

    public string? FieldOfStudy { get; set; }

    public string? Location { get; set; }

    public bool IsOngoing { get; set; }

    [Description("to ISO string")] public string? StartDate { get; set; }

    [Description("to ISO string, if is Ongoing is true, set to any date")]
    public string? EndDate { get; set; }

    [Description("The achievements / courses taken (only if specified)")]
    public List<string> BulletPoints { get; set; } = [];
}

public class ParsedResumeWorkExperience
{
    public string? CompanyName { get; set; }

    public string? CompanyLink { get; set; }

    public string? Title { get; set; }

    [Description("to ISO string")] public string? StartDate { get; set; }

    [Description("to ISO string, if is Ongoing is true, set to any date")]
    public string? EndDate { get; set; }

    public bool IsOngoing { get; set; } = true;
    public string? Location { get; set; }

    [Description("Remote, On-site, Full-time, Part-time, Internship, Contract, Freelance, Other, if specified")]
    public string? WorkType { get; set; }

    [Description("The achievements user got at the company")]
    public List<string> BulletPoints { get; set; } = [];
}

public class ParsedResumeSkill
{
    [Description("Category of skills for the resume eg frontend, backend, soft skills, etc")]
    public string Category { get; set; } = string.Empty;

    [Description("List of skills relating to the category eg React, Python, etc")]
    public List<string> Skills { get; set; } = [];
}