using Resume_builder.Features.BulletPoint.Common;

namespace Resume_builder.Features.Certification.Update;

public record UpdateCertificationCommand(string CertificationId, UpdateCertificationRequest Request);

public class UpdateCertificationRequest
{
    public string? CertificationName { get; set; }

    public string? CertificateLink { get; set; }

    public DateTime? DateAttained { get; set; }

    public List<BulletPointDto> BulletPoints { get; set; }
}
