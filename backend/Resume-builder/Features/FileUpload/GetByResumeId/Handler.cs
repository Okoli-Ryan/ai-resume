using System.Net;
using Microsoft.EntityFrameworkCore;
using Resume_builder.Common;
using Resume_builder.Features.FileUpload.Common;
using Resume_builder.Features.PdfGeneration;
using Resume_builder.Features.Resume.Common;
using Resume_builder.Infrastructure.Persistence.Data;
using Resume_builder.Infrastructure.Repositories.ResumeRepository;
using Resume_builder.Infrastructure.Services.ClaimService;
using Resume_builder.Infrastructure.Services.FileStorageService;
using Resume_builder.Infrastructure.Services.UrlShortenerService.Common;

namespace Resume_builder.Features.FileUpload.GetByResumeId;

public class GetFileUploadsByResumeIdHandler(
    AppDbContext db,
    IClaimsService claimsService,
    IResumeRepository resumeRepository,
    IPdfGenerationService pdfService,
    IFileStorageService fileStorageService,
    IUrlShortenerService urlShortenerService,
    IHostEnvironment hostEnvironment)
    : IResponseHandler<GetFileUploadsByResumeIdQuery, FileUploadDto?>
{
    public async Task<Response<FileUploadDto?>> Handle(GetFileUploadsByResumeIdQuery query,
        CancellationToken cancellationToken)
    {
        var userId = claimsService.GetUserId();

        if (userId is null)
            return Response<FileUploadDto?>.Fail(HttpStatusCode.Unauthorized, "Unauthorized");

        var resume = await resumeRepository.GetResumeByUserAndResumeId(userId, query.ResumeId, cancellationToken);

        if (resume is null)
            return Response<FileUploadDto?>.Fail(HttpStatusCode.NotFound, "Resume not found");

        var entity = await db.FileUpload
            .FirstOrDefaultAsync(
                x => x.ResumeId == query.ResumeId && x.Version == resume.Version && x.UserId == userId,
                cancellationToken);

        if (entity is not null)
            return Response<FileUploadDto?>.Success(entity.ToDto());

        var pdfBytes = pdfService.GeneratePdf(resume.ToDto());

        var fileName = !string.IsNullOrEmpty(resume.ResumeName)
            ? $"{resume.ResumeName}.pdf"
            : $"resume-{DateTime.UtcNow:yyyyMMddHHmmss}.pdf";

        var uploadResult =
            await fileStorageService.UploadAsync(pdfBytes, fileName, "application/pdf", cancellationToken);

        if (uploadResult is null)
            return Response<FileUploadDto?>.Fail(HttpStatusCode.InternalServerError, "File upload failed");

        var shortenedUrl = hostEnvironment.IsDevelopment()
            ? uploadResult.Url
            : await urlShortenerService.Shorten(uploadResult.Url, cancellationToken);

        var newEntity = new FileUploadEntity
        {
            ResumeId = query.ResumeId,
            Version = resume.Version,
            Url = uploadResult.Url,
            ShortenedUrl = shortenedUrl,
            FileKey = uploadResult.Key,
            UserId = userId
        };

        db.FileUpload.Add(newEntity);
        await db.SaveChangesAsync(cancellationToken);

        return Response<FileUploadDto?>.Success(newEntity.ToDto());
    }
}