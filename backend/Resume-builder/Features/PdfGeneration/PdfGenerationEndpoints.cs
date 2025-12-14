using Carter;
using Microsoft.EntityFrameworkCore;
using Resume_builder.Features.Resume;
using Resume_builder.Features.Resume.Common;
using Resume_builder.Infrastructure.Persistence.Data;
using Resume_builder.Infrastructure.Repositories.ResumeRepository;
using Resume_builder.Infrastructure.Services.ClaimService;

namespace Resume_builder.Features.PdfGeneration;

public class PdfGenerationModule : CarterModule
{
    public override void AddRoutes(IEndpointRouteBuilder app)
    {
        var endpoint = app.MapGroup("resume").WithTags("Resume PDF Generation")
            .RequireAuthorization();

        endpoint.MapGet("{resumeId}/pdf", async (
            AppDbContext db,
            string resumeId,
            IResumeRepository resumeRepository,
            IClaimsService claimsService,
            IPdfGenerationService pdfService,
            CancellationToken cancellationToken) =>
        {
            var userId = claimsService.GetUserId();
            if (string.IsNullOrEmpty(userId))
            {
                return Results.Unauthorized();
            }

            var resume = await resumeRepository.GetResumeByUserAndResumeId(userId, resumeId, cancellationToken);

            if (resume == null)
            {
                return Results.NotFound("Resume not found");
            }

            // Convert to DTO
            var resumeDto = resume.ToDto();

            // Generate PDF
            var pdfBytes = pdfService.GeneratePdf(resumeDto);

            var filename = !string.IsNullOrEmpty(resume.ResumeName)
                ? $"{resume.ResumeName}.pdf"
                : $"resume-{DateTime.UtcNow:yyyyMMddHHmmss}.pdf";

            return Results.File(pdfBytes, "application/pdf", filename);
        });
    }
}
