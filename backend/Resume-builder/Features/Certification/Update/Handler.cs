using System.Net;
using Microsoft.EntityFrameworkCore;
using Resume_builder.Common;
using Resume_builder.Features.BulletPoint.Common;
using Resume_builder.Features.Certification.Common;
using Resume_builder.Infrastructure.Persistence.Data;
using Resume_builder.Infrastructure.Services.ClaimService;

namespace Resume_builder.Features.Certification.Update;

public class UpdateCertificationHandler(AppDbContext db, IClaimsService claimsService)
    : IResponseHandler<UpdateCertificationCommand, CertificationDto>
{
    public async Task<Response<CertificationDto>> Handle(UpdateCertificationCommand command,
        CancellationToken cancellationToken)
    {
        var request = command.Request;

        var userId = claimsService.GetUserId();

        if (userId is null)
            return Response<CertificationDto>.Fail(HttpStatusCode.Unauthorized, "Unauthorized");

        var certification = await db.Certification
            .FirstOrDefaultAsync(x => x.Id == command.CertificationId && x.UserId == userId, cancellationToken);

        if (certification is null)
            return Response<CertificationDto>.Fail(HttpStatusCode.NotFound, "Certification Data not found");

        certification.CertificationName = request.CertificationName;
        certification.CertificateLink = request.CertificateLink;
        certification.DateAttained = request.DateAttained;
        certification.UserId = userId;
        certification.BulletPoints = request.BulletPoints.Select(x => x.ToEntity()).ToList();

        db.Certification.Update(certification);
        await db.SaveChangesAsync(cancellationToken);

        return Response<CertificationDto>.Success(certification.ToDto());
    }
}
