using System.Text.Json.Serialization;

namespace Resume_builder.Infrastructure.Services.FileStorageService;

// Request body for POST /v7/prepareUpload
internal sealed class PrepareUploadRequest
{
    [JsonPropertyName("files")]
    public List<PrepareUploadFileInput> Files { get; init; } = [];
}

internal sealed class PrepareUploadFileInput
{
    [JsonPropertyName("name")]
    public string Name { get; init; } = string.Empty;

    [JsonPropertyName("size")]
    public long Size { get; init; }

    [JsonPropertyName("type")]
    public string Type { get; init; } = string.Empty;

    [JsonPropertyName("contentDisposition")]
    public string ContentDisposition { get; init; } = "inline";
}

// Response from POST /v7/prepareUpload — wrapped in a "data" array
internal sealed class PrepareUploadResponse
{
    [JsonPropertyName("data")]
    public List<PresignedUrlData>? Data { get; init; }
}

// Each presigned URL entry returned by /v7/prepareUpload (matches NewPresignedUrl schema)
internal sealed class PresignedUrlData
{
    [JsonPropertyName("url")]
    public string Url { get; init; } = string.Empty;

    [JsonPropertyName("key")]
    public string Key { get; init; } = string.Empty;

    [JsonPropertyName("name")]
    public string Name { get; init; } = string.Empty;

    [JsonPropertyName("customId")]
    public string? CustomId { get; init; }
}

// Response from PUT to ingest presigned URL
internal sealed class UploadPutResult
{
    [JsonPropertyName("ufsUrl")]
    public string UfsUrl { get; init; } = string.Empty;

    [JsonPropertyName("key")]
    public string Key { get; init; } = string.Empty;

    [JsonPropertyName("fileHash")]
    public string FileHash { get; init; } = string.Empty;
}
