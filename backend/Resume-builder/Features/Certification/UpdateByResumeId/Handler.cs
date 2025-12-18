using System.Net;
using Microsoft.EntityFrameworkCore;
using Resume_builder.Common;
using Resume_builder.Features.BulletPoint;
using Resume_builder.Features.BulletPoint.Common;
using Resume_builder.Features.Certification.Common;
using Resume_builder.Infrastructure.Persistence.Data;
using Resume_builder.Infrastructure.Services.ClaimService;

namespace Resume_builder.Features.Certification.UpdateByResumeId;

public class UpdateCertificationByResumeIdHandler(AppDbContext db, IClaimsService claimsService)
    : IResponseHandler<UpdateCertificationByResumeIdCommand, List<CertificationDto>>
{
    public async Task<Response<List<CertificationDto>>> Handle(UpdateCertificationByResumeIdCommand command,
        CancellationToken cancellationToken)
    {
        var request = command.Requests;
        var resumeId = command.ResumeId;

        var userId = claimsService.GetUserId();

        if (userId is null)
            return Response<List<CertificationDto>>.Fail(HttpStatusCode.Unauthorized, "Unauthorized");

        var existingCertifications = await db.Certification
            .Where(x => x.ResumeId == command.ResumeId && x.UserId == userId)
            .Include(x => x.BulletPoints)
            .ToListAsync(cancellationToken);

        db.Certification.RemoveRange(existingCertifications);

        // Add new certifications from the request
        var newCertifications = request.Select(dto =>
        {
            var newCert = new CertificationEntity
            {
                CertificationName = dto.CertificationName,
                CertificateLink = dto.CertificateLink,
                DateAttained = dto.DateAttained,
                UserId = userId,
                ResumeId = resumeId,
            };
            
            newCert.BulletPoints = dto.BulletPoints.Select(bp =>
            {
                var bullet = new BulletPointEntity
                {
                    Text = bp.Text,
                    Order = bp.Order
                };
                bullet.Certification = newCert;
                return bullet;
            }).ToList();

            return newCert;
        }).ToList();

        await db.Certification.AddRangeAsync(newCertifications, cancellationToken);
        await db.SaveChangesAsync(cancellationToken);

        return Response<List<CertificationDto>>.Success(newCertifications.Select(e => e.ToDto()).ToList());
    }
}
