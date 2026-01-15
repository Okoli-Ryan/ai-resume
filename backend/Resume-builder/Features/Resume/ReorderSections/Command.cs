namespace Resume_builder.Features.Resume.ReorderSections;

public record ReorderSectionsCommand(string ResumeId, ReorderSectionsRequest Request);

/// <summary>
/// Request for reordering resume sections
/// </summary>
public class ReorderSectionsRequest
{
    /// <summary>
    /// Comma-separated list of section names in desired order
    /// Example: "WorkExperience,Skills,Projects,Education,Certifications"
    /// </summary>
    public string Order { get; set; } = string.Empty;
}
