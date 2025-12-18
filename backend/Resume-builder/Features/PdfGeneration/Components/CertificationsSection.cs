using QuestPDF.Fluent;
using QuestPDF.Infrastructure;
using Resume_builder.Features.Resume.Common;

namespace Resume_builder.Features.PdfGeneration.Components;

public class CertificationsSection : IComponent
{
    private readonly ResumeDto _resume;

    public CertificationsSection(ResumeDto resume)
    {
        _resume = resume;
    }

    public void Compose(IContainer container)
    {
        var certificationsList = _resume.Certifications;

        if (certificationsList == null || certificationsList.Count == 0)
            return;

        container.PreventPageBreak().Column(column =>
        {
            column.Item().Component(new SectionHeader("Certifications"));

            foreach (var certification in certificationsList)
            {
                column.Item().PreventPageBreak().PaddingBottom(6).Column(certColumn =>
                {
                    // Certification Name and Date row
                    certColumn.Item().Row(row =>
                    {
                        // If certificate link exists, render as hyperlink, otherwise as bold text
                        if (!string.IsNullOrEmpty(certification.CertificateLink))
                        {
                            row.RelativeItem().Hyperlink(certification.CertificateLink)
                                .Text(certification.CertificationName?.ToUpper() ?? string.Empty)
                                .FontSize(10)
                                .Bold()
                                .FontColor("#0066cc");
                        }
                        else
                        {
                            row.RelativeItem().Text(certification.CertificationName?.ToUpper() ?? string.Empty)
                                .FontSize(10)
                                .Bold();
                        }

                        var dateAttained = certification.DateAttained?.ToString("MMM yyyy") ?? string.Empty;
                        row.RelativeItem().AlignRight().Text(dateAttained)
                            .FontSize(10)
                            .Italic();
                    });

                    // Bullet points
                    if (certification.BulletPoints != null && certification.BulletPoints.Count > 0)
                    {
                        certColumn.Item().PaddingTop(4).Column(bpColumn =>
                        {
                            foreach (var bulletPoint in certification.BulletPoints)
                            {
                                bpColumn.Item().PaddingBottom(2).Component(new BulletPoint(bulletPoint.Text));
                            }
                        });
                    }
                });
            }
        });
    }
}
