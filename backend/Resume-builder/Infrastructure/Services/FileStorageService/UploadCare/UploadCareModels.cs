using System.Text.Json.Serialization;

namespace Resume_builder.Infrastructure.Services.FileStorageService;

// Form fields sent to POST https://upload.uploadcare.com/base/
internal sealed class UploadCareUploadRequest
{
    public string PubKey { get; init; } = string.Empty;
    public string Store { get; init; } = "1";
    public string? ResumeId { get; init; }
    public string FileName { get; init; } = string.Empty;
    public required Stream File { get; init; }
}

// Response from POST https://upload.uploadcare.com/base/
// Shape: { [fileName]: "uuid" }
internal sealed class UploadCareUploadResponse
{
    public Dictionary<string, string> Files { get; init; } = [];
}

// Response from GET https://api.uploadcare.com/files/{uuid}
internal sealed class UploadCareFileInfo
{
    [JsonPropertyName("uuid")] public string Uuid { get; init; } = string.Empty;

    [JsonPropertyName("original_filename")] public string OriginalFilename { get; init; } = string.Empty;

    [JsonPropertyName("original_file_url")] public string OriginalFileUrl { get; init; } = string.Empty;
    [JsonPropertyName("size")] public long Size { get; init; } = 0;
}
