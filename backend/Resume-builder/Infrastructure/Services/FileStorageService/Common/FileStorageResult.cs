namespace Resume_builder.Infrastructure.Services.FileStorageService;

public class FileStorageResult
{
    public string Key { get; init; } = string.Empty;
    public string Url { get; init; } = string.Empty;
    public string Name { get; init; } = string.Empty;
    public string ShortenedUrl { get; init; } = string.Empty;
    public long Size { get; init; }
}