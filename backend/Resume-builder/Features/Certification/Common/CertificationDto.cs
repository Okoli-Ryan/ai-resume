using Resume_builder.Common;
using Resume_builder.Features.BulletPoint.Common;

namespace Resume_builder.Features.Certification.Common;

public class CertificationDto : BaseEntity
{
    public string? CertificationName { get; set; }

    public string? CertificateLink { get; set; }

    public DateTime? DateAttained { get; set; }

    public required string ResumeId { get; set; }

    public required string UserId { get; set; }
    public List<BulletPointDto> BulletPoints { get; set; }
}
