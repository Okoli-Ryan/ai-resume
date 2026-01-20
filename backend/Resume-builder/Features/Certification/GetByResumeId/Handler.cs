using System.Net;
using Microsoft.EntityFrameworkCore;
using Resume_builder.Common;
using Resume_builder.Features.Certification.Common;
using Resume_builder.Infrastructure.Persistence.Data;
using Resume_builder.Infrastructure.Services.ClaimService;

namespace Resume_builder.Features.Certification.GetByResumeId;

public class GetCertificationsByResumeIdHandler(AppDbContext db, IClaimsService claimsService)
{
    public async Task<Response<List<CertificationDto>>> Handle(string resumeId, CancellationToken cancellationToken)
    {
        var userId = claimsService.GetUserId();

        if (userId is null)
            return Response<List<CertificationDto>>.Fail(HttpStatusCode.Unauthorized, "Unauthorized");

        // Verify the resume belongs to the user
        var resumeExists = await db.Resume
            .AnyAsync(r => r.Id == resumeId && r.UserId == userId, cancellationToken);

        if (!resumeExists)
            return Response<List<CertificationDto>>.Fail(HttpStatusCode.NotFound, "Resume not found");

        var certifications = await db.Certification
            .Where(c => c.ResumeId == resumeId && c.UserId == userId)
            .Include(c => c.BulletPoints)
            .AsNoTracking()
            .ToListAsync(cancellationToken);

        var certificationDtos = certifications.Select(c => c.ToDto()).ToList();

        return Response<List<CertificationDto>>.Success(certificationDtos);
    }
}
