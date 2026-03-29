using Carter;
using Resume_builder.Common;
using Resume_builder.Features.PdfGeneration.GeneratePDF;
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
            string resumeId,
            IResumeRepository resumeRepository,
            IClaimsService claimsService,
            IPdfGenerationService pdfService,
            CancellationToken cancellationToken) =>
        {
            var handler = new GeneratePdfHandler(resumeRepository, claimsService, pdfService);
            var response = await handler.Handle(new GeneratePdfCommand(resumeId), cancellationToken);

            if (!response.IsSuccess || response.Data is null)
                return response.GetResult();

            return (IResult)Results.File(response.Data.PdfBytes, "application/pdf", response.Data.Filename);
        });
    }
}
