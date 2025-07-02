using Microsoft.Extensions.AI;
using OpenAI;
using ChatMessage = Microsoft.Extensions.AI.ChatMessage;

namespace Resume_builder.Infrastructure.Services.AIChatClient.OpenAI;

public partial class OpenAiChatClient : IAIChatClient
{
    private readonly IChatClient _chatClient;

    public OpenAiChatClient(string model, string apiKey)
    {
        _chatClient = new OpenAIClient(apiKey).GetChatClient(model).AsIChatClient();
    }

    public void Dispose()
    {
    }

    public async Task<ChatResponse> GetResponseAsync(IEnumerable<ChatMessage> messages, ChatOptions? options = null,
        CancellationToken cancellationToken = new())
    {
        return new ChatResponse();
    }

    public IAsyncEnumerable<ChatResponseUpdate> GetStreamingResponseAsync(IEnumerable<ChatMessage> messages,
        ChatOptions? options = null,
        CancellationToken cancellationToken = new())
    {
        return null!;
    }

    public object? GetService(Type serviceType, object? serviceKey = null)
    {
        return null;
    }
}