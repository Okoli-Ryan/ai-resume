using Microsoft.Extensions.AI;

namespace Resume_builder.Infrastructure.Services.AIChatClient.Ollama;

public partial class OllamaChatClient(HttpClient httpClient, string model) : IAIChatClient
{
    public async Task<ChatResponse> GetResponseAsync(IEnumerable<ChatMessage> messages, ChatOptions? options,
        CancellationToken cancellationToken)
    {
        var request = new
        {
            model,
            messages = messages.Select(x => new
                { Role = x.Role.Value.ToLower(), Content = x.Contents[0].RawRepresentation }),
            stream = false
        };

        return await GetChatResponse(request, cancellationToken);
    }


    public void Dispose()
    {
    }

    public IAsyncEnumerable<ChatResponseUpdate> GetStreamingResponseAsync(IEnumerable<ChatMessage> messages,
        ChatOptions? options = null,
        CancellationToken cancellationToken = new())
    {
        throw new NotImplementedException();
    }

    public object? GetService(Type serviceType, object? serviceKey = null)
    {
        throw new NotImplementedException();
    }
}