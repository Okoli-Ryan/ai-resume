using QuestPDF.Fluent;
using QuestPDF.Infrastructure;
using Resume_builder.Features.Resume.Common;

namespace Resume_builder.Features.PdfGeneration.Components;

public class EducationSection : IComponent
{
    private readonly ResumeDto _resume;

    public EducationSection(ResumeDto resume)
    {
        _resume = resume;
    }

    public void Compose(IContainer container)
    {
        var educationList = _resume.Education;

        if (educationList == null || educationList.Count == 0)
            return;

        container.PreventPageBreak().Column(column =>
        {
            column.Item().Component(new SectionHeader("Education"));

            foreach (var education in educationList)
            {
                column.Item().PreventPageBreak().PaddingBottom(6).Column(eduColumn =>
                {
                    // School Name and Date row
                    eduColumn.Item().Row(row =>
                    {
                        row.RelativeItem().Text(education.SchoolName?.ToUpper() ?? string.Empty)
                            .FontSize(10)
                            .Bold();

                        var dateRange = FormatDateRange(education.StartDate, education.EndDate, education.IsOngoing);
                        row.RelativeItem().AlignRight().Text(dateRange)
                            .FontSize(10)
                            .Italic();
                    });

                    // Degree and Location row
                    eduColumn.Item().Row(row =>
                    {
                        var degreeText = education.Degree ?? string.Empty;
                        if (!string.IsNullOrEmpty(education.FieldOfStudy))
                        {
                            degreeText += $" in {education.FieldOfStudy}";
                        }

                        row.RelativeItem().Text(degreeText)
                            .FontSize(10)
                            .Italic();

                        row.RelativeItem().AlignRight().Text(education.Location ?? string.Empty)
                            .FontSize(10)
                            .Italic();
                    });

                    // Bullet points
                    if (education.BulletPoints != null && education.BulletPoints.Count > 0)
                    {
                        eduColumn.Item().PaddingTop(4).Column(bpColumn =>
                        {
                            foreach (var bulletPoint in education.BulletPoints)
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
