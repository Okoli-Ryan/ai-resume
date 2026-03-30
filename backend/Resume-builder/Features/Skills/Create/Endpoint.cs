using Carter;
using Resume_builder.Common;

namespace Resume_builder.Features.Skills.Create;

public class CreateSkillEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGroup("skill")
            .RequireAuthorization()
            .MapPost("", async (
                CreateSkillCommand command,
                CreateSkillHandler handler,
                CancellationToken cancellationToken) =>
            {
                var result = await handler.Handle(command, cancellationToken);

                return result.GetResult();
            });
    }
}
