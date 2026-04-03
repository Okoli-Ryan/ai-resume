using System.Net.Http.Json;
using Microsoft.Extensions.Options;
using Resume_builder.Common;

namespace Resume_builder.Infrastructure.Services.FileStorageService;

public class UploadThingFileStorageService(IOptions<AppSettings> appSettings, IHttpClientFactory httpClientFactory)
    : IFileStorageService
{
    private const string PrepareUploadUrl = "https://api.uploadthing.com/v7/prepareUpload";

    public async Task<FileStorageResult?> UploadAsync(IFormFile file, CancellationToken cancellationToken)
    {
        var apiKey = appSettings.Value.UploadThingApiKey;
        if (string.IsNullOrWhiteSpace(apiKey))
            return null;

        var presigned = await GetPresignedUrlAsync(apiKey, file, cancellationToken);
        if (presigned is null)
            return null;

        var putResult = await UploadToPresignedUrlAsync(apiKey, presigned.Url, file, cancellationToken);
        if (putResult is null)
            return null;

        return new FileStorageResult
        {
            Key = presigned.Key,
            Url = putResult.UfsUrl,
            Name = file.FileName,
            Size = file.Length
        };
    }

    private async Task<PresignedUrlData?> GetPresignedUrlAsync(
        string apiKey,
        IFormFile file,
        CancellationToken cancellationToken)
    {
        var client = httpClientFactory.CreateClient();
        client.DefaultRequestHeaders.Add("x-uploadthing-api-key", apiKey);
        client.DefaultRequestHeaders.Add("x-uploadthing-be-adapter", "dotnet");

        var request = new PrepareUploadRequest
        {
            Files =
            [
                new PrepareUploadFileInput
                {
                    Name = file.FileName,
                    Size = file.Length,
                    Type = file.ContentType
                }
            ]
        };

        var response = await client.PostAsJsonAsync(PrepareUploadUrl, request, cancellationToken);

        if (!response.IsSuccessStatusCode)
            return null;

        var result = await response.Content.ReadFromJsonAsync<PrepareUploadResponse>(cancellationToken);
        return result?.Data?.FirstOrDefault();
    }

    private async Task<UploadPutResult?> UploadToPresignedUrlAsync(
        string apiKey,
        string presignedUrl,
        IFormFile file,
        CancellationToken cancellationToken)
    {
        var client = httpClientFactory.CreateClient();

        using var content = new MultipartFormDataContent();
        await using var stream = file.OpenReadStream();
        using var streamContent = new StreamContent(stream);
        streamContent.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue(file.ContentType);
        content.Add(streamContent, "file", file.FileName);

        using var request = new HttpRequestMessage(HttpMethod.Put, presignedUrl) { Content = content };
        request.Headers.TryAddWithoutValidation("x-uploadthing-api-key", apiKey);
        request.Headers.TryAddWithoutValidation("Range", "bytes=0-");

        var response = await client.SendAsync(request, cancellationToken);

        if (!response.IsSuccessStatusCode)
            return null;

        return await response.Content.ReadFromJsonAsync<UploadPutResult>(cancellationToken);
    }
}
