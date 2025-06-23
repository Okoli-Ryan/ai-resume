using System.Net;
using Resume_builder.Common;
using Resume_builder.Features.BulletPoint.Common;
using Resume_builder.Features.Project.Common;
using Resume_builder.Infrastructure.Persistence.Data;
using Resume_builder.Infrastructure.Services.ClaimService;

namespace Resume_builder.Features.Project.Create;

public class CreateProjectHandler(AppDbContext db, IClaimsService claimsService)
    : IResponseHandler<CreateProjectCommand, ProjectDto>
{
    public async Task<Response<ProjectDto>> Handle(CreateProjectCommand request, CancellationToken cancellationToken)
    {
        var userId = claimsService.GetUserId();

        if (userId is null)
            return Response<ProjectDto>.Fail(HttpStatusCode.Unauthorized, "Unauthorized");

        var project = new ProjectEntity
        {
            ProjectName = request.Name,
            ProjectUrl = request.Link,
            ResumeId = request.ResumeId,
            UserId = userId,
            BulletPoints = request.BulletPoints.Select(x => x.ToEntity()).ToList()
        };

        db.Project.Add(project);
        await db.SaveChangesAsync(cancellationToken);

        return Response<ProjectDto>.Success(project.ToDto());
    }
}