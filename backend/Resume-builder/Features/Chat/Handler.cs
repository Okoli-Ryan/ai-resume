using System.Net;
using Microsoft.Extensions.AI;
using Resume_builder.Common;

namespace Resume_builder.Features.Chat;

public class ChatHandler(IChatClient chatClient) : IResponseHandler<ChatCommand, string>
{
    public async Task<Response<string>> Handle(ChatCommand command, CancellationToken cancellationToken)
    {
        var messages = new List<ChatMessage>
        {
            new()
            {
                AuthorName = "System",
                Role = ChatRole.System,
                Contents =
                [
                    new AIContent
                    {
                        RawRepresentation = "Answer in a british accent"
                    }
                ],
                MessageId = null,
                RawRepresentation = null,
                AdditionalProperties = null
            },
            new()
            {
                AuthorName = "User",
                Role = ChatRole.User,
                Contents =
                [
                    new AIContent
                    {
                        RawRepresentation = command.Prompt
                    }
                ],
                MessageId = null,
                RawRepresentation = null,
                AdditionalProperties = null
            }
        };
        try
        {
            var response = await chatClient.GetResponseAsync(messages, null, cancellationToken);

            return Response<string>.Success(response.Messages[0].Text + " " + response.Usage?.TotalTokenCount);
        }
        catch (Exception e)
        {
            return Response<string>.Fail(HttpStatusCode.InternalServerError, e.Message);
        }
    }
}