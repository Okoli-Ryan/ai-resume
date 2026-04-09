using System.Text.Json.Serialization;

namespace Resume_builder.Infrastructure.Services.UrlShortenerService.ShortIo;

internal sealed class ShortIoResponse
{
    [JsonPropertyName("secureShortURL")] public string SecureShortURL { get; set; }
}