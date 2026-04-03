namespace Resume_builder.Infrastructure.Services.FileStorageService;

public interface IFileStorageService
{
    Task<FileStorageResult?> UploadAsync(IFormFile file, CancellationToken cancellationToken);
}
