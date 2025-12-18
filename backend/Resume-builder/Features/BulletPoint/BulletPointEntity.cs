using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Resume_builder.Common;
using Resume_builder.Features.Certification;
using Resume_builder.Features.Education;
using Resume_builder.Features.Project;
using Resume_builder.Features.WorkExperience;

namespace Resume_builder.Features.BulletPoint;

public class BulletPointEntity : BaseEntity
{
    public string Text { get; set; } = string.Empty;
    public int Order { get; set; }
    public string? EducationId { get; set; }
    public virtual EducationEntity? Education { get; set; }
    public string? ProjectId { get; set; }
    public virtual ProjectEntity? Project { get; set; }
    public string? WorkExperienceId { get; set; }
    public virtual WorkExperienceEntity? WorkExperience { get; set; }
    public string? CertificationId { get; set; }
    public virtual CertificationEntity? Certification { get; set; }
}
