using Carter;
using Microsoft.EntityFrameworkCore;
using Resume_builder.Features.Resume;
using Resume_builder.Features.Resume.Common;
using Resume_builder.Infrastructure.Persistence.Data;
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
            IClaimsService claimsService,
            IPdfGenerationService pdfService,
            CancellationToken cancellationToken) =>
        {
            var userId = claimsService.GetUserId();
            if (string.IsNullOrEmpty(userId))
            {
                return Results.Unauthorized();
            }

            var resume = await db.Resume
                .Include(r => r.WorkExperience!)
                    .ThenInclude(w => w.BulletPoints)
                .Include(r => r.Education!)
                    .ThenInclude(e => e.BulletPoints)
                .Include(r => r.Projects!)
                    .ThenInclude(p => p.BulletPoints)
                .Include(r => r.Skills)
                .AsNoTracking()
                .FirstOrDefaultAsync(r => r.Id == resumeId && r.UserId == userId, cancellationToken);

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
