using Carter;
using Resume_builder.Common;
using Resume_builder.Features.Resume.Common;
using Resume_builder.Features.Resume.Create;
using Resume_builder.Features.Resume.Duplicate;
using Resume_builder.Features.Resume.GetMinimalResumesByUserId;
using Resume_builder.Features.Resume.GetResumeById;
using Resume_builder.Features.Resume.GetResumesByUserId;
using Resume_builder.Features.Resume.Update;
using Resume_builder.Infrastructure.Persistence.Data;
using Resume_builder.Infrastructure.Repositories.ResumeRepository;
using Resume_builder.Infrastructure.Services.ClaimService;

namespace Resume_builder.Features.Resume;

public class ResumeModule : CarterModule
{
    public override void AddRoutes(IEndpointRouteBuilder app)
    {
        var endpoint = app.MapGroup(ResumeConstants.ResumeMapGroupName).WithTags(ResumeConstants.ResumeMapGroupTag)
            .RequireAuthorization();

        endpoint.MapGet("{resumeId}", async (
            string resumeId,
            IClaimsService claimsService,
            IResumeRepository resumeRepository,
            CancellationToken cancellationToken) =>
        {
            var handler = new GetResumeByIdHandler(resumeRepository, claimsService);
            var response = await handler.Handle(resumeId, cancellationToken);

            return response.GetResult();
        });

        endpoint.MapGet("user/{userId}", async (
            AppDbContext db,
            string userId,
            IClaimsService claimsService,
            CancellationToken cancellationToken) =>
        {
            var handler = new GetResumesByUserIdHandler(db, claimsService);
            var response = await handler.Handle(userId, cancellationToken);

            return response.GetResult();
        });


        endpoint.MapPost("", async (
            CreateResumeCommand command,
            IClaimsService claimsService,
            CreateResumeValidator validator,
            AppDbContext db,
            IHostEnvironment env,
            CancellationToken cancellationToken
        ) =>
        {
            var validationError = await validator.ValidateRequest(command);
            if (validationError != null)
                return Results.BadRequest(validationError);

            var handler = new CreateResumeHandler(db, env, claimsService);
            var response = await handler.Handle(command, cancellationToken);

            return response.GetResult();
        });


        endpoint.MapPut("{resumeId}", async (
            string resumeId,
            UpdateResumeRequest request,
            UpdateResumeValidator validator,
            AppDbContext db,
            IClaimsService claimsService,
            CancellationToken cancellationToken
        ) =>
        {
            var validationError = await validator.ValidateRequest(request);
            if (validationError != null)
                return Results.BadRequest(validationError);

            var handler = new UpdateResumeHandler(db, claimsService);
            var response = await handler.Handle(new UpdateResumeCommand(resumeId, request), cancellationToken);

            return response.GetResult();
        });


        endpoint.MapPost("duplicate/{resumeId}", async (
            string resumeId,
            AppDbContext db,
            IClaimsService claimsService,
            IHostEnvironment env,
            IResumeRepository resumeRepository,
            CancellationToken cancellationToken
        ) =>
        {
            var handler = new DuplicateResumeHandler(db, claimsService, resumeRepository, env);
            var response = await handler.Handle(new DuplicateResumeCommand(resumeId), cancellationToken);

            return response.GetResult();
        });


        endpoint.MapGet("{userId}/minimal", async (
            string userId,
            AppDbContext db,
            IClaimsService claimsService,
            CancellationToken cancellationToken
        ) =>
        {
            var handler = new GetMinimalResumesByUserIdHandler(db, claimsService);
            var response = await handler.Handle(userId, cancellationToken);

            return response.GetResult();
        });
    }
}