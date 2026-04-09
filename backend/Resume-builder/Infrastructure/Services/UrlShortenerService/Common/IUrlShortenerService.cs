namespace Resume_builder.Infrastructure.Services.UrlShortenerService.Common;

public interface IUrlShortenerService
{
    public Task<string> Shorten(string url, CancellationToken cancellationToken = default);
}