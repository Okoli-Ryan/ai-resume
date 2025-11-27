using QuestPDF.Fluent;
using QuestPDF.Infrastructure;

namespace Resume_builder.Features.PdfGeneration.Components;

public class SectionHeader : IComponent
{
    private readonly string _title;

    public SectionHeader(string title)
    {
        _title = title;
    }

    public void Compose(IContainer container)
    {
        container.Column(column =>
        {
            column.Item().PaddingTop(8).Text(_title.ToUpper())
                .FontSize(10)
                .Bold();

            column.Item().PaddingBottom(6).BorderBottom(1).BorderColor("#000000");
        });
    }
}
