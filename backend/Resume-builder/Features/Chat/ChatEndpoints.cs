using Carter;
using Microsoft.Extensions.AI;
using Resume_builder.Common;

namespace Resume_builder.Features.Chat;

public class ChatEndpoints : CarterModule
{
    public override void AddRoutes(IEndpointRouteBuilder app)
    {
        var endpoint = app.MapGroup("chat").WithTags("Chat");

        endpoint.MapPost("", async (
            ChatCommand command,
            IChatClient chatClient,
            CancellationToken cancellationToken) =>
        {
            var handler = new ChatHandler(chatClient);

            var response = await handler.Handle(command, cancellationToken);

            return response.GetResult();
        });
    }
}