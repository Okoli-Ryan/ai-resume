namespace Resume_builder.Features.Certification.PatchUpdate;

public record PatchUpdateCertificationCommand(string CertificationId, PatchUpdateCertificationRequest Request);

public class PatchUpdateCertificationRequest
{
    public string? CertificationName { get; set; }
    public string? CertificateLink { get; set; }
    public DateTime? DateAttained { get; set; }
}
