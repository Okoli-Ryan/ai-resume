using Resume_builder.Features.BulletPoint;
using Resume_builder.Features.BulletPoint.Common;

namespace Resume_builder.Features.Certification.Common;

public static class CertificationExtensions
{
    public static CertificationDto ToDto(this CertificationEntity certification)
    {
        return new CertificationDto
        {
            Id = certification.Id,
            CertificationName = certification.CertificationName,
            CertificateLink = certification.CertificateLink,
            DateAttained = certification.DateAttained,
            ResumeId = certification.ResumeId,
            UserId = certification.UserId,
            CreatedAt = certification.CreatedAt,
            UpdatedAt = certification.UpdatedAt,
            ActiveStatus = certification.ActiveStatus,
            BulletPoints = certification.BulletPoints.Select(bp => bp.ToDto()).ToList()
        };
    }

    public static CertificationEntity ToEntity(this CertificationDto certification)
    {
        return new CertificationEntity
        {
            Id = certification.Id,
            CertificationName = certification.CertificationName,
            CertificateLink = certification.CertificateLink,
            DateAttained = certification.DateAttained,
            ResumeId = certification.ResumeId,
            UserId = certification.UserId,
            CreatedAt = certification.CreatedAt,
            UpdatedAt = certification.UpdatedAt,
            ActiveStatus = certification.ActiveStatus,
            BulletPoints = certification.BulletPoints.Select(bp => new BulletPointEntity
            {
                Text = bp.Text,
                Order = bp.Order,
                CertificationId = certification.Id
            }).ToList()
        };
    }
}
