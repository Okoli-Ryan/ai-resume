using System.Net.Http.Headers;
using System.Security.Cryptography;
using System.Text;
using Microsoft.Extensions.Options;
using Resume_builder.Common;

namespace Resume_builder.Infrastructure.Services.FileStorageService;

public class UploadCareFileStorageService(IOptions<AppSettings> appSettings, IHttpClientFactory httpClientFactory)
    : IFileStorageService
{
    private const string UploadBaseUrl = "https://upload.uploadcare.com/base/";
    private const string FilesApiBaseUrl = "https://api.uploadcare.com/files/";

    public async Task<FileStorageResult?> UploadAsync(IFormFile file, CancellationToken cancellationToken)
    {
        var pubKey = appSettings.Value.UploadCarePublicKey;
        if (string.IsNullOrWhiteSpace(pubKey))
            return null;

        await using var stream = file.OpenReadStream();
        return await UploadToUploadCareAsync(pubKey, file.FileName, stream, file.ContentType, resumeId: null, cancellationToken);
    }

    public async Task<FileStorageResult?> UploadAsync(byte[] bytes, string fileName, string contentType,
        CancellationToken cancellationToken)
    {
        var pubKey = appSettings.Value.UploadCarePublicKey;
        if (string.IsNullOrWhiteSpace(pubKey))
            return null;

        using var stream = new MemoryStream(bytes);
        return await UploadToUploadCareAsync(pubKey, fileName, stream, contentType, resumeId: null, cancellationToken);
    }

    private async Task<FileStorageResult?> UploadToUploadCareAsync(
        string pubKey,
        string fileName,
        Stream stream,
        string contentType,
        string? resumeId,
        CancellationToken cancellationToken)
    {
        var client = httpClientFactory.CreateClient();

        using var content = new MultipartFormDataContent();
        content.Add(new StringContent(pubKey), "UPLOADCARE_PUB_KEY");
        content.Add(new StringContent("1"), "UPLOADCARE_STORE");

        if (resumeId is not null)
            content.Add(new StringContent("Metadata[resumeId]"), "resumeId");

        content.Add(new StringContent(fileName), "fileName");

        using var streamContent = new StreamContent(stream);
        streamContent.Headers.ContentType = new MediaTypeHeaderValue(contentType);
        content.Add(streamContent, "file", fileName);

        var response = await client.PostAsync(UploadBaseUrl, content, cancellationToken);
        if (!response.IsSuccessStatusCode)
            return null;

        // Response shape: { [fileName]: "uuid" }
        var result = await response.Content.ReadFromJsonAsync<Dictionary<string, string>>(cancellationToken);
        if (result is null || result.Count == 0)
            return null;

        var (name, uuid) = result.First();

        var fileInfo = await GetFileInfoAsync(uuid, cancellationToken);

        return new FileStorageResult
        {
            Key = uuid,
            Url = fileInfo?.OriginalFileUrl ?? $"https://ucarecdn.com/{uuid}/",
            Name = name,
            Size = fileInfo?.Size ?? 0
        };
    }

    private async Task<UploadCareFileInfo?> GetFileInfoAsync(string uuid, CancellationToken cancellationToken)
    {
        var pubKey = appSettings.Value.UploadCarePublicKey;
        var secretKey = appSettings.Value.UploadCareSecretKey;
        if (string.IsNullOrWhiteSpace(pubKey) || string.IsNullOrWhiteSpace(secretKey))
            return null;

        var requestPath = $"/files/{uuid}/";
        var date = DateTimeOffset.UtcNow.ToString("ddd, dd MMM yyyy HH:mm:ss 'GMT'");
        var authorization = BuildAuthorizationHeader("GET", [], string.Empty, date, requestPath, pubKey, secretKey);

        var client = httpClientFactory.CreateClient();

        using var request = new HttpRequestMessage(HttpMethod.Get, $"{FilesApiBaseUrl}{uuid}/");
        request.Headers.TryAddWithoutValidation("Authorization", authorization);
        request.Headers.TryAddWithoutValidation("Accept", "application/vnd.uploadcare-v0.7+json");
        request.Headers.TryAddWithoutValidation("Date", date);

        var response = await client.SendAsync(request, cancellationToken);
        if (!response.IsSuccessStatusCode)
            return null;

        return await response.Content.ReadFromJsonAsync<UploadCareFileInfo>(cancellationToken);
    }

    /// <summary>
    /// Builds the Uploadcare HMAC/SHA1 Authorization header value.
    /// Sign string: "{method}\n{md5body}\n{contentType}\n{date}\n{uri}"
    /// </summary>
    private static string BuildAuthorizationHeader(
        string method,
        byte[] body,
        string contentType,
        string date,
        string uri,
        string pubKey,
        string secretKey)
    {
        var md5Body = Convert.ToHexString(MD5.HashData(body)).ToLowerInvariant();
        var signString = $"{method}\n{md5Body}\n{contentType}\n{date}\n{uri}";
        var keyBytes = Encoding.UTF8.GetBytes(secretKey);
        var messageBytes = Encoding.UTF8.GetBytes(signString);
        var signature = Convert.ToHexString(HMACSHA1.HashData(keyBytes, messageBytes)).ToLowerInvariant();
        return $"Uploadcare {pubKey}:{signature}";
    }
}
