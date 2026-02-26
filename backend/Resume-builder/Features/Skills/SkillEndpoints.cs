using Carter;
using Resume_builder.Common;
using Resume_builder.Features.Skills.Create;
using Resume_builder.Features.Skills.Delete;
using Resume_builder.Features.Skills.GetByResumeId;
using Resume_builder.Features.Skills.PatchUpdate;
using Resume_builder.Features.Skills.Update;
using Resume_builder.Features.Skills.UpdateByResumeId;
using Resume_builder.Infrastructure.Persistence.Data;
using Resume_builder.Infrastructure.Services.ClaimService;

namespace Resume_builder.Features.Skills;

public class SkillEndpoints : CarterModule
{
    public override void AddRoutes(IEndpointRouteBuilder app)
    {
        var endpoint = app.MapGroup("skill").RequireAuthorization();

        endpoint.MapGet("/resume/{resumeId}", async (
            string resumeId,
            AppDbContext db,
            IClaimsService claimsService,
            CancellationToken cancellationToken) =>
        {
            var handler = new GetSkillsByResumeIdHandler(db, claimsService);
            var response = await handler.Handle(resumeId, cancellationToken);

            return response.GetResult();
        });

        endpoint.MapPost("", async (
            CreateSkillCommand command,
            AppDbContext db,
            IClaimsService claimsService,
            CancellationToken cancellationToken) =>
        {
            var handler = new CreateSkillHandler(db, claimsService);
            var result = await handler.Handle(command, cancellationToken);

            return result.GetResult();
        });


        endpoint.MapPost("{skillId}", async (
            string skillId,
            UpdateSkillRequest request,
            AppDbContext db,
            IClaimsService claimsService,
            CancellationToken cancellationToken) =>
        {
            var handler = new UpdateSkillHandler(db, claimsService);
            var result = await handler.Handle(new UpdateSkillCommand(skillId, request), cancellationToken);

            return result.GetResult();
        });
        
        
        endpoint.MapPut("/resume/{resumeId}", async (
            string resumeId,
            List<UpdateSkillRequest> request,
            AppDbContext db,
            IClaimsService claimsService,
            CancellationToken cancellationToken) =>
        {
            var handler = new UpdateSkillsByResumeIdHandler(db, claimsService);

            var response = await handler.Handle(new UpdateSkillsByResumeIdCommand(resumeId, request), cancellationToken);

            return response.GetResult();
        });

        endpoint.MapPatch("{skillId}", async (
            string skillId,
            PatchUpdateSkillRequest request,
            PatchUpdateSkillValidator validator,
            AppDbContext db,
            IClaimsService claimsService,
            CancellationToken cancellationToken) =>
        {
            var validationError = await validator.ValidateRequest(request);
            if (validationError != null)
                return Results.BadRequest(validationError);

            var handler = new PatchUpdateSkillHandler(db, claimsService);

            var response = await handler.Handle(new PatchUpdateSkillCommand(skillId, request), cancellationToken);

            return response.GetResult();
        }).WithName("Patch Update Skill");

        endpoint.MapDelete("{skillId}", async (
            string skillId,
            AppDbContext db,
            IClaimsService claimsService,
            CancellationToken cancellationToken) =>
        {
            var handler = new DeleteSkillHandler(db, claimsService);

            var response = await handler.Handle(new DeleteSkillCommand(skillId), cancellationToken);

            return response.GetResult();
        }).WithName("Delete Skill");
    }
}