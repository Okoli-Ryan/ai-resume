using System.Text.Json.Nodes;

namespace Resume_builder.Infrastructure.Services.AIChatClient.Common;

public class OllamaChatRequest
{
    public string Model { get; set; }
    public List<OllamaChatMessage> Messages { get; set; } = [];
    public bool Stream { get; set; }
    public JsonNode? Format { get; set; }
}

public class OllamaChatMessage
{
    public string Role { get; set; } // "system", "user", or "assistant"
    public string Content { get; set; }
}

public class EnhanceBulletPointRequest
{
    public string BulletPoint { get; set; }
    public string? Role { get; set; }
    public string? Tags { get; set; }
}

public class EnhanceWorkExperienceBulletPointsRequest
{
    public List<string> BulletPoints { get; set; }
    public string? Role { get; set; }
    public string? Tags { get; set; }
}