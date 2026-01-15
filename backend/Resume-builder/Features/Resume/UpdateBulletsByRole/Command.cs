using Resume_builder.Features.BulletPoint.Common;

namespace Resume_builder.Features.Resume.UpdateBulletsByRole;

public record UpdateBulletsByRoleCommand(string ResumeId, UpdateBulletsByRoleRequest Request);

/// <summary>
/// Request for updating bullet points tailored to a specific role
/// </summary>
public class UpdateBulletsByRoleRequest
{
    public string TargetRole { get; set; } = string.Empty;
    public List<BulletPointUpdate> BulletPoints { get; set; } = new();
}

/// <summary>
/// Individual bullet point update
/// </summary>
public class BulletPointUpdate
{
    /// <summary>
    /// The ID of the bullet point to update
    /// </summary>
    public string BulletPointId { get; set; } = string.Empty;
    
    /// <summary>
    /// The updated text for the bullet point
    /// </summary>
    public string Text { get; set; } = string.Empty;
}

/// <summary>
/// Response containing updated bullet points
/// </summary>
public class UpdateBulletsByRoleResponse
{
    public string ResumeId { get; set; } = string.Empty;
    public string TargetRole { get; set; } = string.Empty;
    public List<BulletPointDto> UpdatedBulletPoints { get; set; } = new();
    public int TotalUpdated { get; set; }
}
