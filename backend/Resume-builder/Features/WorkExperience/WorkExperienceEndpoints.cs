using Carter;
using Resume_builder.Common;
using Resume_builder.Features.WorkExperience.Create;
using Resume_builder.Features.WorkExperience.Update;
using Resume_builder.Features.WorkExperience.UpdateByResumeId;
using Resume_builder.Infrastructure.Persistence.Data;
using Resume_builder.Infrastructure.Services.ClaimService;

namespace Resume_builder.Features.WorkExperience;

public class WorkExperienceEndpoints : CarterModule
{
    public override void AddRoutes(IEndpointRouteBuilder app)
    {
        var endpoint = app.MapGroup("work-experience").WithTags("Work Experience").RequireAuthorization();

        endpoint.MapPost("", async (
                CreateWorkExperienceCommand command,
                CreateWorkExperienceValidator validator,
                IClaimsService claimsService,
                AppDbContext db,
                CancellationToken cancellationToken) =>
            {
                var validationError = await validator.ValidateRequest(command);
                if (validationError != null)
                    return Results.BadRequest(validationError);

                var handler = new CreateWorkExperienceHandler(db, claimsService);

                var result = await handler.Handle(command, cancellationToken);
                return result.GetResult();
            })
            .WithName("Create Work Experience");


        endpoint.MapPut("{workExperienceId}", async (
                string workExperienceId,
                UpdateWorkExperienceRequest request,
                UpdateWorkExperienceValidator validator,
                IClaimsService claimsService,
                AppDbContext db,
                CancellationToken cancellationToken) =>
            {
                var validationError = await validator.ValidateRequest(request);
                if (validationError != null)
                    return Results.BadRequest(validationError);

                var command = new UpdateWorkExperienceCommand(workExperienceId, request);

                var handler = new UpdateWorkExperienceHandler(db, claimsService);

                var result = await handler.Handle(command, cancellationToken);
                return Results.Ok(result);
            })
            .WithName("Update Work Experience");
        
        
        endpoint.MapPut("/resume/{resumeId}", async (
            string resumeId,
            List<UpdateWorkExperienceRequest> request,
            AppDbContext db,
            IClaimsService claimsService,
            CancellationToken cancellationToken) =>
        {
            var handler = new UpdateWorkExperienceByResumeIdHandler(db, claimsService);

            var response = await handler.Handle(new UpdateWorkExperienceByResumeIdCommand(resumeId, request), cancellationToken);

            return response.GetResult();
        });
    }
}