using Carter;
using Resume_builder.Common;
using Resume_builder.Features.Project.Create;
using Resume_builder.Features.Project.Update;
using Resume_builder.Features.Project.UpdateByResumeId;
using Resume_builder.Infrastructure.Persistence.Data;
using Resume_builder.Infrastructure.Services.ClaimService;

namespace Resume_builder.Features.Project;

public class ProjectModule : CarterModule
{
    public override void AddRoutes(IEndpointRouteBuilder app)
    {
        var endpoint = app.MapGroup("project").WithTags("Project");

        endpoint.MapPost("", async (
            CreateProjectCommand command,
            CreateProjectValidator validator,
            AppDbContext dbContext,
            IClaimsService claimsService,
            CancellationToken cancellationToken) =>
        {
            var validationError = await validator.ValidateRequest(command);
            if (validationError != null)
                return Results.BadRequest(validationError);

            var handler = new CreateProjectHandler(dbContext, claimsService);
            var response = await handler.Handle(command, cancellationToken);

            return response.GetResult();
        });

        endpoint.MapPut("{id}", async (
            string id,
            UpdateProjectRequest request,
            UpdateProjectValidator validator,
            AppDbContext db,
            IClaimsService claimsService,
            CancellationToken cancellationToken) =>
        {
            var validationError = await validator.ValidateRequest(request);
            if (validationError != null)
                return Results.BadRequest(validationError);

            var handler = new UpdateProjectHandler(db, claimsService);
            var response = await handler.Handle(new UpdateProjectCommand(id, request), cancellationToken);

            return response.GetResult();
        });
        
        
        endpoint.MapPut("/resume/{resumeId}", async (
            string resumeId,
            List<UpdateProjectRequest> request,
            AppDbContext db,
            IClaimsService claimsService,
            CancellationToken cancellationToken) =>
        {
            var handler = new UpdateProjectsByResumeIdHandler(db, claimsService);

            var response = await handler.Handle(new UpdateProjectsByResumeIdCommand(resumeId, request), cancellationToken);

            return response.GetResult();
        });
    }
}