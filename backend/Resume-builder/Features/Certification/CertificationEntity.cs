using System.ComponentModel.DataAnnotations;
using Resume_builder.Common;
using Resume_builder.Features.BulletPoint;
using Resume_builder.Features.Resume;
using Resume_builder.Features.Users;

namespace Resume_builder.Features.Certification;

public class CertificationEntity : BaseEntity
{
    [MaxLength(200)] public string? CertificationName { get; set; }

    [MaxLength(500)] public string? CertificateLink { get; set; }

    public DateTime? DateAttained { get; set; }

    public required string ResumeId { get; set; }

    public required string UserId { get; set; }

    public virtual ResumeEntity? Resume { get; set; }

    public virtual User? User { get; set; }
    public virtual List<BulletPointEntity> BulletPoints { get; set; } = [];
}
