using System.Net.Http.Headers;
using Microsoft.Extensions.Options;
using Resume_builder.Common;
using Resume_builder.Utils;

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

        var presigned =
            await GetPresignedUrlAsync(apiKey, file.FileName, file.Length, file.ContentType, cancellationToken);
        if (presigned is null)
            return null;

        await using var stream = file.OpenReadStream();
        var putResult = await UploadToPresignedUrlAsync(apiKey, presigned.Url, stream, file.FileName, file.ContentType,
            cancellationToken);
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

    public async Task<FileStorageResult?> UploadAsync(byte[] bytes, string fileName, string contentType,
        CancellationToken cancellationToken)
    {
        var apiKey = appSettings.Value.UploadThingApiKey;
        if (string.IsNullOrWhiteSpace(apiKey))
            return null;

        var presigned = await GetPresignedUrlAsync(apiKey, fileName, bytes.Length, contentType, cancellationToken);
        if (presigned is null)
            return null;

        using var stream = new MemoryStream(bytes);
        var putResult =
            await UploadToPresignedUrlAsync(apiKey, presigned.Url, stream, fileName, contentType, cancellationToken);
        if (putResult is null)
            return null;

        return new FileStorageResult
        {
            Key = presigned.Key,
            Url = putResult.UfsUrl,
            Name = fileName,
            Size = bytes.Length
        };
    }

    private async Task<PresignedUrlData?> GetPresignedUrlAsync(
        string apiKey,
        string fileName,
        long fileSize,
        string contentType,
        CancellationToken cancellationToken)
    {
        var client = httpClientFactory.CreateClient();
        client.DefaultRequestHeaders.Add("x-uploadthing-api-key", apiKey);
        // client.DefaultRequestHeaders.Add("x-uploadthing-be-adapter", "dotnet");

        var request = new PrepareUploadFileInput
        {
            Name = fileName,
            Size = fileSize,
            Type = contentType,
            CustomId = RandomStringGenerator.Generate(32),
            Acl = "public-read",
            Slug = "resume",
            ContentDisposition = "attachment",
            ExpiresIn = 3600
        };

        var response = await client.PostAsJsonAsync(PrepareUploadUrl, request, cancellationToken);

        if (!response.IsSuccessStatusCode)
            return null;

        var result = await response.Content.ReadFromJsonAsync<PresignedUrlData>(cancellationToken);
        return result;
    }

    private async Task<UploadPutResult?> UploadToPresignedUrlAsync(
        string apiKey,
        string presignedUrl,
        Stream stream,
        string fileName,
        string contentType,
        CancellationToken cancellationToken)
    {
        var client = httpClientFactory.CreateClient();

        using var content = new MultipartFormDataContent();
        using var streamContent = new StreamContent(stream);
        streamContent.Headers.ContentType = new MediaTypeHeaderValue(contentType);
        content.Add(streamContent, "file", fileName);

        using var request = new HttpRequestMessage(HttpMethod.Put, presignedUrl) { Content = content };

        var response = await client.SendAsync(request, cancellationToken);

        if (!response.IsSuccessStatusCode)
            return null;

        return await response.Content.ReadFromJsonAsync<UploadPutResult>(cancellationToken);
    }
}