using System.Net;
using Resume_builder.Common;
using Resume_builder.Features.Resume.Common;
using Resume_builder.Infrastructure.Repositories.ResumeRepository;
using Resume_builder.Infrastructure.Services.ClaimService;

namespace Resume_builder.Features.PdfGeneration.GeneratePDF;

public class GeneratePdfHandler(
    IResumeRepository resumeRepository,
    IClaimsService claimsService,
    IPdfGenerationService pdfService)
    : IResponseHandler<GeneratePdfCommand, GeneratePdfResult>
{
    public async Task<Response<GeneratePdfResult>> Handle(GeneratePdfCommand command, CancellationToken cancellationToken)
    {
        var userId = claimsService.GetUserId();

        if (string.IsNullOrEmpty(userId))
            return Response<GeneratePdfResult>.Fail(HttpStatusCode.Unauthorized, "Unauthorized");

        var resume = await resumeRepository.GetResumeByUserAndResumeId(userId, command.ResumeId, cancellationToken);

        if (resume is null)
            return Response<GeneratePdfResult>.Fail(HttpStatusCode.NotFound, "Resume not found");

        var resumeDto = resume.ToDto();
        var pdfBytes = pdfService.GeneratePdf(resumeDto);

        var filename = !string.IsNullOrEmpty(resume.ResumeName)
            ? $"{resume.ResumeName}.pdf"
            : $"resume-{DateTime.UtcNow:yyyyMMddHHmmss}.pdf";

        return Response<GeneratePdfResult>.Success(new GeneratePdfResult(pdfBytes, filename));
    }
}
