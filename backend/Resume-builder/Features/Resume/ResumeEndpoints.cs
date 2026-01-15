using Carter;
using Resume_builder.Common;
using Resume_builder.Features.Resume.Common;
using Resume_builder.Features.Resume.Create;
using Resume_builder.Features.Resume.Duplicate;
using Resume_builder.Features.Resume.GetMinimalResumesByUserId;
using Resume_builder.Features.Resume.GetResumeById;
using Resume_builder.Features.Resume.GetResumesByUserId;
using Resume_builder.Features.Resume.GetSections;
using Resume_builder.Features.Resume.Patch;
using Resume_builder.Features.Resume.ReorderSections;
using Resume_builder.Features.Resume.TailorToRole;
using Resume_builder.Features.Resume.Update;
using Resume_builder.Features.Resume.UpdateBulletsByRole;
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


        // PATCH endpoint for partial resume updates
        endpoint.MapPatch("{resumeId}", async (
            string resumeId,
            PatchResumeRequest request,
            AppDbContext db,
            IClaimsService claimsService,
            CancellationToken cancellationToken
        ) =>
        {
            var handler = new PatchResumeHandler(db, claimsService);
            var response = await handler.Handle(new PatchResumeCommand(resumeId, request), cancellationToken);

            return response.GetResult();
        }).WithSummary("Partially update resume")
          .WithDescription("Update only the specified fields of a resume. All fields are optional.");


        // Get all sections of a resume
        endpoint.MapGet("{resumeId}/sections", async (
            string resumeId,
            AppDbContext db,
            IClaimsService claimsService,
            CancellationToken cancellationToken
        ) =>
        {
            var handler = new GetAllSectionsHandler(db, claimsService);
            var response = await handler.Handle(resumeId, cancellationToken);

            return response.GetResult();
        }).WithSummary("Get all resume sections")
          .WithDescription("Retrieve all sections (Projects, Education, WorkExperience, Skills, Certifications) for a resume");


        // Get individual section types
        endpoint.MapGet("{resumeId}/sections/projects", async (
            string resumeId,
            AppDbContext db,
            IClaimsService claimsService,
            CancellationToken cancellationToken
        ) =>
        {
            var handler = new GetProjectsSectionHandler(db, claimsService);
            var response = await handler.Handle(resumeId, cancellationToken);

            return response.GetResult();
        }).WithSummary("Get projects section");

        endpoint.MapGet("{resumeId}/sections/education", async (
            string resumeId,
            AppDbContext db,
            IClaimsService claimsService,
            CancellationToken cancellationToken
        ) =>
        {
            var handler = new GetEducationSectionHandler(db, claimsService);
            var response = await handler.Handle(resumeId, cancellationToken);

            return response.GetResult();
        }).WithSummary("Get education section");

        endpoint.MapGet("{resumeId}/sections/work-experience", async (
            string resumeId,
            AppDbContext db,
            IClaimsService claimsService,
            CancellationToken cancellationToken
        ) =>
        {
            var handler = new GetWorkExperienceSectionHandler(db, claimsService);
            var response = await handler.Handle(resumeId, cancellationToken);

            return response.GetResult();
        }).WithSummary("Get work experience section");

        endpoint.MapGet("{resumeId}/sections/skills", async (
            string resumeId,
            AppDbContext db,
            IClaimsService claimsService,
            CancellationToken cancellationToken
        ) =>
        {
            var handler = new GetSkillsSectionHandler(db, claimsService);
            var response = await handler.Handle(resumeId, cancellationToken);

            return response.GetResult();
        }).WithSummary("Get skills section");

        endpoint.MapGet("{resumeId}/sections/certifications", async (
            string resumeId,
            AppDbContext db,
            IClaimsService claimsService,
            CancellationToken cancellationToken
        ) =>
        {
            var handler = new GetCertificationsSectionHandler(db, claimsService);
            var response = await handler.Handle(resumeId, cancellationToken);

            return response.GetResult();
        }).WithSummary("Get certifications section");


        // Tailor resume to a specific role
        endpoint.MapGet("{resumeId}/tailor", async (
            string resumeId,
            string role,
            AppDbContext db,
            IClaimsService claimsService,
            CancellationToken cancellationToken
        ) =>
        {
            var handler = new TailorResumeHandler(db, claimsService);
            var response = await handler.Handle(new TailorResumeCommand(resumeId, role), cancellationToken);

            return response.GetResult();
        }).WithSummary("Get tailoring suggestions for a role")
          .WithDescription("Analyze and provide recommendations for tailoring the resume to a specific role");


        // Reorder resume sections
        endpoint.MapPatch("{resumeId}/reorder", async (
            string resumeId,
            ReorderSectionsRequest request,
            AppDbContext db,
            IClaimsService claimsService,
            CancellationToken cancellationToken
        ) =>
        {
            var handler = new ReorderSectionsHandler(db, claimsService);
            var response = await handler.Handle(new ReorderSectionsCommand(resumeId, request), cancellationToken);

            return response.GetResult();
        }).WithSummary("Reorder resume sections")
          .WithDescription("Update the order of sections in the resume based on provided sequence");


        // Update bullet points for a specific role
        endpoint.MapPatch("{resumeId}/bullets", async (
            string resumeId,
            UpdateBulletsByRoleRequest request,
            AppDbContext db,
            IClaimsService claimsService,
            CancellationToken cancellationToken
        ) =>
        {
            var handler = new UpdateBulletsByRoleHandler(db, claimsService);
            var response = await handler.Handle(new UpdateBulletsByRoleCommand(resumeId, request), cancellationToken);

            return response.GetResult();
        }).WithSummary("Update bullet points for a role")
          .WithDescription("Update multiple bullet points across the resume, typically tailored for a specific role");
    }
}