using QuestPDF.Fluent;
using QuestPDF.Helpers;
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
            column.Item().Decoration(decoration =>
            {
                decoration.Header()
                    .Text(_title.ToUpper())
                    .FontSize(10)
                    .Bold();

                decoration.Content().Element(e =>
                {
                    e.ExtendHorizontal()
                        .BorderBottom(1)
                        .BorderColor(Colors.Black)
                        .PaddingBottom(2);
                });

            });  
            
            column.Item().PaddingTop(4);
        });
    }
}