using Microsoft.Extensions.Options;
using Resume_builder.Common;
using Resume_builder.Infrastructure.Services.UrlShortenerService.Common;

namespace Resume_builder.Infrastructure.Services.UrlShortenerService.ShortIo;

public class ShortIoService(HttpClient httpClient, IOptions<AppSettings> appSettings) : IUrlShortenerService
{
    private const string Domain = "i-cv.short.gy";
    private const string BaseUrl = "https://api.short.io/links/tweetbot";

    private readonly string _apiKey = appSettings.Value.ShortIoApiKey ??
                                      throw new InvalidOperationException("ShortIoApiKey is not configured.");

    public async Task<string> Shorten(string url, CancellationToken cancellationToken = default)
    {
        try
        {
            var requestUrl =
                $"{BaseUrl}?domain={Uri.EscapeDataString(Domain)}&originalURL={Uri.EscapeDataString(url)}&apiKey={Uri.EscapeDataString(_apiKey)}";

            var response = await httpClient.GetAsync(requestUrl, cancellationToken);
            response.EnsureSuccessStatusCode();

            var data = await response.Content.ReadFromJsonAsync<ShortIoResponse>(cancellationToken);
            return data.SecureShortURL;
        }
        catch
        {
            return url;
        }
    }
}