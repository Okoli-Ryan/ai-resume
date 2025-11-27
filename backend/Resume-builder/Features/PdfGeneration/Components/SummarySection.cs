using QuestPDF.Fluent;
using QuestPDF.Infrastructure;
using Resume_builder.Features.Resume.Common;

namespace Resume_builder.Features.PdfGeneration.Components;

public class SummarySection : IComponent
{
    private readonly ResumeDto _resume;

    public SummarySection(ResumeDto resume)
    {
        _resume = resume;
    }

    public void Compose(IContainer container)
    {
        var summary = _resume.Summary;

        if (string.IsNullOrEmpty(summary) || summary == "<p></p>")
            return;

        // Strip HTML tags from summary
        var plainSummary = HtmlUtils.StripHtmlTags(summary);

        container.Column(column =>
        {
            column.Item().Component(new SectionHeader("Summary"));

            column.Item().Text(plainSummary)
                .FontSize(10)
                .LineHeight(1.3f);
        });
    }
}
