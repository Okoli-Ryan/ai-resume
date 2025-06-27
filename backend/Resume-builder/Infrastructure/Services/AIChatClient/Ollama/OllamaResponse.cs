using System.Text.Json.Serialization;

namespace Resume_builder.Infrastructure.Services.AIChatClient.Ollama;

public class OllamaResponse
{
    [JsonPropertyName("model")] public string Model { get; set; } = string.Empty;

    [JsonPropertyName("created_at")] public DateTime CreatedAt { get; set; }

    [JsonPropertyName("message")] public AIMessage Message { get; set; } = new();

    [JsonPropertyName("done")] public bool Done { get; set; }

    [JsonPropertyName("prompt_eval_count")]
    public int PromptEvalCount { get; set; }

    [JsonPropertyName("eval_count")] public int EvalCount { get; set; }
}

public class AIMessage
{
    [JsonPropertyName("role")] public string Role { get; set; } = string.Empty;

    [JsonPropertyName("content")] public string Content { get; set; } = string.Empty;
}