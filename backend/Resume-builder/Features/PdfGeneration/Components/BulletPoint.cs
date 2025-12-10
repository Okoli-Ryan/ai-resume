using QuestPDF.Fluent;
using QuestPDF.Infrastructure;

namespace Resume_builder.Features.PdfGeneration.Components;

public class BulletPoint : IComponent
{
    private readonly string _text;

    public BulletPoint(string text)
    {
        _text = HtmlUtils.StripHtmlTags(text);
    }

    public void Compose(IContainer container)
    {
        container.Row(row =>
        {
            // Bullet container (aligned correctly)
            row.ConstantItem(10) // width of bullet area
                .AlignCenter() // aligns bullet with text top
                .Height(10) // gives enough height to center
                .Element(bullet =>
                {
                    bullet.AlignCenter().AlignMiddle()
                        .Width(4).Height(4)
                        .Background("#000000")
                        .CornerRadius(50);
                });

            // Text
            row.RelativeItem()
                .AlignTop() // aligns with bullet
                .Text(_text)
                .FontSize(10)
                .LineHeight(1.3f);
        });
    }
}