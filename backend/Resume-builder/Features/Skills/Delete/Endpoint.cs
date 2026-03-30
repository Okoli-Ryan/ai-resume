using Carter;
using Resume_builder.Common;

namespace Resume_builder.Features.Skills.Delete;

public class DeleteSkillEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGroup("skill")
            .RequireAuthorization()
            .MapDelete("{skillId}", async (
                string skillId,
                DeleteSkillHandler handler,
                CancellationToken cancellationToken) =>
            {
                var response = await handler.Handle(new DeleteSkillCommand(skillId), cancellationToken);

                return response.GetResult();
            })
            .WithName("Delete Skill");
    }
}
