using Carter;
using Resume_builder.Common;
using Resume_builder.Features.Education.Create;
using Resume_builder.Features.Education.Update;
using Resume_builder.Features.Education.UpdateByResumeId;
using Resume_builder.Infrastructure.Persistence.Data;
using Resume_builder.Infrastructure.Services.ClaimService;

namespace Resume_builder.Features.Education;

public class EducationModule : CarterModule
{
    public override void AddRoutes(IEndpointRouteBuilder app)
    {
        var endpoint = app.MapGroup("education").WithTags("Education");

        endpoint.MapPost("", async (
            CreateEducationCommand command,
            CreateEducationValidator validator,
            AppDbContext db,
            IClaimsService claimsService,
            CancellationToken cancellationToken) =>
        {
            var validationError = await validator.ValidateRequest(command);

            if (validationError != null) return Results.BadRequest(validationError);

            var handler = new CreateEducationHandler(db, claimsService);

            var response = await handler.Handle(command, cancellationToken);

            return response.GetResult();
        });


        endpoint.MapPut("{id}", async (
            string id,
            UpdateEducationRequest request,
            UpdateEducationValidator validator,
            AppDbContext db,
            IClaimsService claimsService,
            CancellationToken cancellationToken) =>
        {
            var validationError = await validator.ValidateRequest(request);

            if (validationError != null) return Results.BadRequest(validationError);

            var handler = new UpdateEducationHandler(db, claimsService);

            var response = await handler.Handle(new UpdateEducationCommand(id, request), cancellationToken);

            return response.GetResult();
        });
        
        endpoint.MapPut("/resume/{resumeId}", async (
            string resumeId,
            List<UpdateEducationRequest> request,
            AppDbContext db,
            IClaimsService claimsService,
            CancellationToken cancellationToken) =>
        {
            var handler = new UpdateEducationByResumeIdHandler(db, claimsService);

            var response = await handler.Handle(new UpdateEducationByResumeIdCommand(resumeId, request), cancellationToken);

            return response.GetResult();
        });
    }
}