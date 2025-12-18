using System.Net;
using Resume_builder.Common;
using Resume_builder.Features.BulletPoint;
using Resume_builder.Features.Certification.Common;
using Resume_builder.Infrastructure.Persistence.Data;
using Resume_builder.Infrastructure.Services.ClaimService;

namespace Resume_builder.Features.Certification.Create;

public class CreateCertificationHandler(AppDbContext db, IClaimsService claimsService)
    : IResponseHandler<CreateCertificationCommand, CertificationDto>
{
    public async Task<Response<CertificationDto>> Handle(CreateCertificationCommand request,
        CancellationToken cancellationToken)
    {
        var userId = claimsService.GetUserId();

        if (userId is null)
            return Response<CertificationDto>.Fail(HttpStatusCode.Unauthorized, "Unauthorized");

        var certification = new CertificationEntity
        {
            CertificationName = request.CertificationName,
            CertificateLink = request.CertificateLink,
            DateAttained = request.DateAttained,
            ResumeId = request.ResumeId,
            UserId = userId,
            BulletPoints = request.BulletPoints.Select(x => new BulletPointEntity
            {
                Text = x.Text,
                Order = x.Order
            }).ToList()
        };

        db.Certification.Add(certification);
        await db.SaveChangesAsync(cancellationToken);

        return Response<CertificationDto>.Success(certification.ToDto());
    }
}
