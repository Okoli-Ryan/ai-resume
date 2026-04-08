namespace Resume_builder.Infrastructure.Services.FileStorageService;

public interface IFileStorageService
{
    Task<FileStorageResult?> UploadAsync(IFormFile file, CancellationToken cancellationToken);
    Task<FileStorageResult?> UploadAsync(byte[] bytes, string fileName, string contentType, CancellationToken cancellationToken);
}
