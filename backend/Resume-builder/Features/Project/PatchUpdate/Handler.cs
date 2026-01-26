using System.Net;
using Microsoft.EntityFrameworkCore;
using Resume_builder.Common;
using Resume_builder.Features.Project.Common;
using Resume_builder.Infrastructure.Persistence.Data;
using Resume_builder.Infrastructure.Services.ClaimService;
using Resume_builder.Utils;

namespace Resume_builder.Features.Project.PatchUpdate;

public class PatchUpdateProjectHandler(
    AppDbContext db,
    IClaimsService claimsService) : IResponseHandler<PatchUpdateProjectCommand, ProjectDto>
{
    /// <summary>
    ///     Property mappings from request properties to entity properties
    /// </summary>
    private static readonly Dictionary<string, string> PropertyMappings = new()
    {
        { nameof(PatchUpdateProjectRequest.ProjectName), nameof(ProjectEntity.ProjectName) },
        { nameof(PatchUpdateProjectRequest.ProjectUrl), nameof(ProjectEntity.ProjectUrl) },
    };

    public async Task<Response<ProjectDto>> Handle(PatchUpdateProjectCommand command, CancellationToken cancellationToken)
    {
        var request = command.Request;

        var userId = claimsService.GetUserId();

        if (userId is null)
            return Response<ProjectDto>.Fail(HttpStatusCode.Unauthorized, "Unauthorized");

        var project = await db.Project
            .Where(x => x.UserId == userId && x.Id == command.ProjectId)
            .FirstOrDefaultAsync(cancellationToken);

        if (project == null)
            return Response<ProjectDto>.Fail(HttpStatusCode.NotFound, "Project not found");

        // Apply patch update using the helper
        var hasUpdates = PatchUpdateHelper.ApplyPatch(request, project, PropertyMappings);

        if (hasUpdates)
        {
            db.Project.Update(project);
            await db.SaveChangesAsync(cancellationToken);
        }

        return Response<ProjectDto>.Success(project.ToDto());
    }
}
