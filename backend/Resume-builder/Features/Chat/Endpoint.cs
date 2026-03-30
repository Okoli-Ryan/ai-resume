using Carter;
using Resume_builder.Common;

namespace Resume_builder.Features.Chat;

public class ChatEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGroup("chat")
            .WithTags("Chat")
            .MapPost("", async (
                ChatCommand command,
                ChatHandler handler,
                CancellationToken cancellationToken) =>
            {
                var response = await handler.Handle(command, cancellationToken);

                return response.GetResult();
            });
    }
}
