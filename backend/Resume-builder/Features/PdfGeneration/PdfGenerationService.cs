using QuestPDF.Fluent;
using QuestPDF.Infrastructure;
using Resume_builder.Features.Resume.Common;

namespace Resume_builder.Features.PdfGeneration;

public interface IPdfGenerationService
{
    byte[] GeneratePdf(ResumeDto resume);
}

public class PdfGenerationService : IPdfGenerationService
{
    public PdfGenerationService()
    {
        // Set QuestPDF license type (Community license for open source projects)
        QuestPDF.Settings.License = LicenseType.Community;
    }

    public byte[] GeneratePdf(ResumeDto resume)
    {
        var document = new ResumeDocument(resume);
        return document.GeneratePdf();
    }
}
