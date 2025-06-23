using System.Net;
using Microsoft.EntityFrameworkCore;
using Resume_builder.Common;
using Resume_builder.Features.BulletPoint.Common;
using Resume_builder.Features.Education.Common;
using Resume_builder.Infrastructure.Persistence.Data;
using Resume_builder.Infrastructure.Services.ClaimService;

namespace Resume_builder.Features.Education.Update;

public class UpdateEducationHandler(AppDbContext db, IClaimsService claimsService)
    : IResponseHandler<UpdateEducationCommand, EducationDto>
{
    public async Task<Response<EducationDto>> Handle(UpdateEducationCommand command,
        CancellationToken cancellationToken)
    {
        var request = command.Request;

        var userId = claimsService.GetUserId();

        if (userId is null)
            return Response<EducationDto>.Fail(HttpStatusCode.Unauthorized, "Unauthorized");

        var education = await db.Education
            .FirstOrDefaultAsync(x => x.Id == command.EducationId && x.UserId == userId, cancellationToken);

        if (education is null)
            return Response<EducationDto>.Fail(HttpStatusCode.NotFound, "Education Data not found");

        education.SchoolName = request.SchoolName;
        education.Degree = request.Degree;
        education.FieldOfStudy = request.FieldOfStudy;
        education.Location = request.Location;
        education.IsOngoing = request.IsOngoing;
        education.StartDate = request.StartDate;
        education.EndDate = request.EndDate;
        education.UserId = userId;
        education.BulletPoints = request.BulletPoints.Select(x => x.ToEntity()).ToList();

        db.Education.Update(education);
        await db.SaveChangesAsync(cancellationToken);

        return Response<EducationDto>.Success(education.ToDto());
    }
}