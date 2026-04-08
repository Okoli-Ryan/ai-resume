using System.Text.Json.Serialization;

namespace Resume_builder.Infrastructure.Services.FileStorageService;

// Request body for POST /v7/prepareUpload
internal sealed class PrepareUploadFileInput
{
    [JsonPropertyName("fileName")] public string Name { get; init; } = string.Empty;

    [JsonPropertyName("fileSize")] public long Size { get; init; }

    [JsonPropertyName("fileType")] public string Type { get; init; } = string.Empty;

    [JsonPropertyName("contentDisposition")]
    public string ContentDisposition { get; init; } = "attachment";

    [JsonPropertyName("customId")] public string? CustomId { get; init; }

    [JsonPropertyName("acl")] public string Acl { get; init; } = "public-read";

    [JsonPropertyName("slug")] public string Slug { get; init; } = string.Empty;

    [JsonPropertyName("expiresIn")] public int ExpiresIn { get; init; } = 3600; // 10 years in seconds
}

// Each presigned URL entry returned by /v7/prepareUpload (matches NewPresignedUrl schema)
internal sealed class PresignedUrlData
{
    [JsonPropertyName("url")] public string Url { get; init; } = string.Empty;

    [JsonPropertyName("key")] public string Key { get; init; } = string.Empty;
}

// Response from PUT to ingest presigned URL
internal sealed class UploadPutResult
{
    [JsonPropertyName("ufsUrl")] public string UfsUrl { get; init; } = string.Empty;

    [JsonPropertyName("key")] public string Key { get; init; } = string.Empty;

    [JsonPropertyName("fileHash")] public string FileHash { get; init; } = string.Empty;
}