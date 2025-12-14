using Carter;
using Resume_builder.Common;
using Resume_builder.Features.Link.Create;
using Resume_builder.Features.Link.Delete;
using Resume_builder.Features.Link.GetLinksByResume;
using Resume_builder.Features.Link.GetLinksByUser;
using Resume_builder.Features.Link.Update;
using Resume_builder.Infrastructure.Persistence.Data;
using Resume_builder.Infrastructure.Services.ClaimService;

namespace Resume_builder.Features.Link;

public class LinkModule : CarterModule
{
    public override void AddRoutes(IEndpointRouteBuilder app)
    {
        var endpoint = app.MapGroup("link").WithTags("Link");

        endpoint.MapPost("", async (
            CreateLinkCommand command,
            CreateLinkValidator validator,
            AppDbContext db,
            IClaimsService claimsService,
            CancellationToken cancellationToken) =>
        {
            var validationError = await validator.ValidateRequest(command);

            if (validationError != null) return Results.BadRequest(validationError);

            var handler = new CreateLinkHandler(db, claimsService);

            var response = await handler.Handle(command, cancellationToken);

            return response.GetResult();
        });

        endpoint.MapPut("{id}", async (
            string id,
            UpdateLinkRequest request,
            UpdateLinkValidator validator,
            AppDbContext db,
            IClaimsService claimsService,
            CancellationToken cancellationToken) =>
        {
            var validationError = await validator.ValidateRequest(request);

            if (validationError != null) return Results.BadRequest(validationError);

            var handler = new UpdateLinkHandler(db, claimsService);

            var response = await handler.Handle(new UpdateLinkCommand(id, request), cancellationToken);

            return response.GetResult();
        });

        endpoint.MapDelete("{id}", async (
            string id,
            AppDbContext db,
            IClaimsService claimsService,
            CancellationToken cancellationToken) =>
        {
            var handler = new DeleteLinkHandler(db, claimsService);

            var response = await handler.Handle(new DeleteLinkCommand(id), cancellationToken);

            return response.GetResult();
        });

        endpoint.MapGet("user/{userId}", async (
            string userId,
            AppDbContext db,
            IClaimsService claimsService,
            CancellationToken cancellationToken) =>
        {
            var handler = new GetLinksByUserHandler(db, claimsService);

            var response = await handler.Handle(new GetLinksByUserQuery(userId), cancellationToken);

            return response.GetResult();
        });

        endpoint.MapGet("resume/{resumeId}", async (
            string resumeId,
            AppDbContext db,
            IClaimsService claimsService,
            CancellationToken cancellationToken) =>
        {
            var handler = new GetLinksByResumeHandler(db, claimsService);

            var response = await handler.Handle(new GetLinksByResumeQuery(resumeId), cancellationToken);

            return response.GetResult();
        });
    }
}