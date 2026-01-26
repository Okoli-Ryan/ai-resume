using System.Net;
using Microsoft.EntityFrameworkCore;
using Resume_builder.Common;
using Resume_builder.Features.Certification.Common;
using Resume_builder.Infrastructure.Persistence.Data;
using Resume_builder.Infrastructure.Services.ClaimService;
using Resume_builder.Utils;

namespace Resume_builder.Features.Certification.PatchUpdate;

public class PatchUpdateCertificationHandler(
    AppDbContext db,
    IClaimsService claimsService) : IResponseHandler<PatchUpdateCertificationCommand, CertificationDto>
{
    /// <summary>
    ///     Property mappings from request properties to entity properties
    /// </summary>
    private static readonly Dictionary<string, string> PropertyMappings = new()
    {
        { nameof(PatchUpdateCertificationRequest.CertificationName), nameof(CertificationEntity.CertificationName) },
        { nameof(PatchUpdateCertificationRequest.CertificateLink), nameof(CertificationEntity.CertificateLink) },
        { nameof(PatchUpdateCertificationRequest.DateAttained), nameof(CertificationEntity.DateAttained) },
    };

    public async Task<Response<CertificationDto>> Handle(PatchUpdateCertificationCommand command, CancellationToken cancellationToken)
    {
        var request = command.Request;

        var userId = claimsService.GetUserId();

        if (userId is null)
            return Response<CertificationDto>.Fail(HttpStatusCode.Unauthorized, "Unauthorized");

        var certification = await db.Certification
            .Where(x => x.UserId == userId && x.Id == command.CertificationId)
            .FirstOrDefaultAsync(cancellationToken);

        if (certification == null)
            return Response<CertificationDto>.Fail(HttpStatusCode.NotFound, "Certification not found");

        // Apply patch update using the helper
        var hasUpdates = PatchUpdateHelper.ApplyPatch(request, certification, PropertyMappings);

        if (hasUpdates)
        {
            db.Certification.Update(certification);
            await db.SaveChangesAsync(cancellationToken);
        }

        return Response<CertificationDto>.Success(certification.ToDto());
    }
}
