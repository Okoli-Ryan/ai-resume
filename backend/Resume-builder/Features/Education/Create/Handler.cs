using System.Net;
using Resume_builder.Common;
using Resume_builder.Features.BulletPoint;
using Resume_builder.Features.Education.Common;
using Resume_builder.Infrastructure.Persistence.Data;
using Resume_builder.Infrastructure.Services.ClaimService;

namespace Resume_builder.Features.Education.Create;

public class CreateEducationHandler(AppDbContext db, IClaimsService claimsService)
    : IResponseHandler<CreateEducationCommand, EducationDto>
{
    public async Task<Response<EducationDto>> Handle(CreateEducationCommand request,
        CancellationToken cancellationToken)
    {
        var userId = claimsService.GetUserId();

        if (userId is null)
            return Response<EducationDto>.Fail(HttpStatusCode.Unauthorized, "Unauthorized");

        var education = new EducationEntity
        {
            SchoolName = request.SchoolName,
            Degree = request.Degree,
            FieldOfStudy = request.FieldOfStudy,
            Location = request.Location,
            IsOngoing = request.IsOngoing,
            StartDate = request.StartDate,
            EndDate = request.EndDate,
            ResumeId = request.ResumeId,
            UserId = userId,
            BulletPoints = request.BulletPoints.Select(x => new BulletPointEntity
            {
                Text = x.Text,
                Order = x.Order
            }).ToList()
        };

        db.Education.Add(education);
        await db.SaveChangesAsync(cancellationToken);

        return Response<EducationDto>.Success(education.ToDto());
    }
}