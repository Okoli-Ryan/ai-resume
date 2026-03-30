using Carter;
using Resume_builder.Common;

namespace Resume_builder.Features.Skills.PatchUpdate;

public class PatchUpdateSkillEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGroup("skill")
            .RequireAuthorization()
            .MapPatch("{skillId}", async (
                string skillId,
                PatchUpdateSkillRequest request,
                PatchUpdateSkillValidator validator,
                PatchUpdateSkillHandler handler,
                CancellationToken cancellationToken) =>
            {
                var validationError = await validator.ValidateRequest(request);
                if (validationError != null)
                    return Results.BadRequest(validationError);

                var response = await handler.Handle(new PatchUpdateSkillCommand(skillId, request), cancellationToken);

                return response.GetResult();
            })
            .WithName("Patch Update Skill");
    }
}
