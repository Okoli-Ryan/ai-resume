using System.ComponentModel.DataAnnotations.Schema;
using Resume_builder.Common;
using Resume_builder.Features.Resume;
using Resume_builder.Features.Users;

namespace Resume_builder.Features.Skills;

public class SkillEntity : BaseEntity
{
    public string Group { get; set; } = string.Empty;
    public string Skills { get; set; } = string.Empty;
    public required string UserId { get; set; }
    public required string ResumeId { get; set; }

    [ForeignKey("UserId")]
    public virtual User? User { get; set; }
    
    [ForeignKey("ResumeId")]

    public virtual ResumeEntity? Resume { get; set; }
}