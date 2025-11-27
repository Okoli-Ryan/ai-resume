using QuestPDF.Fluent;
using QuestPDF.Infrastructure;
using Resume_builder.Features.Resume.Common;

namespace Resume_builder.Features.PdfGeneration.Components;

public class WorkExperienceSection : IComponent
{
    private readonly ResumeDto _resume;

    public WorkExperienceSection(ResumeDto resume)
    {
        _resume = resume;
    }

    public void Compose(IContainer container)
    {
        var experiences = _resume.WorkExperience;

        if (experiences == null || experiences.Count == 0)
            return;

        container.Column(column =>
        {
            column.Item().Component(new SectionHeader("Work Experience"));

            foreach (var experience in experiences)
            {
                column.Item().PaddingBottom(6).Column(expColumn =>
                {
                    // Company Name and Location row
                    expColumn.Item().Row(row =>
                    {
                        row.RelativeItem().Text(experience.CompanyName?.ToUpper() ?? string.Empty)
                            .FontSize(10)
                            .Bold();

                        row.RelativeItem().AlignRight().Text(experience.Location ?? string.Empty)
                            .FontSize(10)
                            .Italic();
                    });

                    // Title and Date row
                    expColumn.Item().Row(row =>
                    {
                        var titleText = experience.Title ?? string.Empty;
                        if (!string.IsNullOrEmpty(experience.WorkType))
                        {
                            titleText += $" ({experience.WorkType})";
                        }

                        row.RelativeItem().Text(titleText)
                            .FontSize(10)
                            .Italic();

                        var dateRange = FormatDateRange(experience.StartDate, experience.EndDate, experience.IsOngoing);
                        row.RelativeItem().AlignRight().Text(dateRange)
                            .FontSize(10)
                            .Italic();
                    });

                    // Bullet points
                    if (experience.BulletPoints != null && experience.BulletPoints.Count > 0)
                    {
                        expColumn.Item().PaddingTop(2).Column(bpColumn =>
                        {
                            foreach (var bulletPoint in experience.BulletPoints)
                            {
                                bpColumn.Item().PaddingBottom(2).Component(new BulletPoint(bulletPoint.Text));
                            }
                        });
                    }
                });
            }
        });
    }

    private static string FormatDateRange(DateTime? startDate, DateTime? endDate, bool isOngoing)
    {
        var start = startDate?.ToString("MMM yyyy") ?? string.Empty;
        var end = isOngoing ? "Present" : endDate?.ToString("MMM yyyy") ?? string.Empty;
        return $"{start} - {end}";
    }
}
