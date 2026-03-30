using Carter;
using Resume_builder.Common;

namespace Resume_builder.Features.Skills.Update;

public class UpdateSkillEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGroup("skill")
            .RequireAuthorization()
            .MapPost("{skillId}", async (
                string skillId,
                UpdateSkillRequest request,
                UpdateSkillHandler handler,
                CancellationToken cancellationToken) =>
            {
                var result = await handler.Handle(new UpdateSkillCommand(skillId, request), cancellationToken);

                return result.GetResult();
            });
    }
}
