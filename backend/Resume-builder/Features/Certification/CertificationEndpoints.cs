using Carter;
using Resume_builder.Common;
using Resume_builder.Features.Certification.Create;
using Resume_builder.Features.Certification.Update;
using Resume_builder.Features.Certification.UpdateByResumeId;
using Resume_builder.Infrastructure.Persistence.Data;
using Resume_builder.Infrastructure.Services.ClaimService;

namespace Resume_builder.Features.Certification;

public class CertificationModule : CarterModule
{
    public override void AddRoutes(IEndpointRouteBuilder app)
    {
        var endpoint = app.MapGroup("certification").WithTags("Certification");

        endpoint.MapPost("", async (
            CreateCertificationCommand command,
            CreateCertificationValidator validator,
            AppDbContext db,
            IClaimsService claimsService,
            CancellationToken cancellationToken) =>
        {
            var validationError = await validator.ValidateRequest(command);

            if (validationError != null) return Results.BadRequest(validationError);

            var handler = new CreateCertificationHandler(db, claimsService);

            var response = await handler.Handle(command, cancellationToken);

            return response.GetResult();
        });


        endpoint.MapPut("{id}", async (
            string id,
            UpdateCertificationRequest request,
            UpdateCertificationValidator validator,
            AppDbContext db,
            IClaimsService claimsService,
            CancellationToken cancellationToken) =>
        {
            var validationError = await validator.ValidateRequest(request);

            if (validationError != null) return Results.BadRequest(validationError);

            var handler = new UpdateCertificationHandler(db, claimsService);

            var response = await handler.Handle(new UpdateCertificationCommand(id, request), cancellationToken);

            return response.GetResult();
        });
        
        endpoint.MapPut("/resume/{resumeId}", async (
            string resumeId,
            List<UpdateCertificationRequest> request,
            AppDbContext db,
            IClaimsService claimsService,
            CancellationToken cancellationToken) =>
        {
            var handler = new UpdateCertificationByResumeIdHandler(db, claimsService);

            var response = await handler.Handle(new UpdateCertificationByResumeIdCommand(resumeId, request), cancellationToken);

            return response.GetResult();
        });
    }
}
