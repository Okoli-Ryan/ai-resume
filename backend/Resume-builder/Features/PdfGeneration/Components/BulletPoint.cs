using QuestPDF.Fluent;
using QuestPDF.Infrastructure;

namespace Resume_builder.Features.PdfGeneration.Components;

public class BulletPoint : IComponent
{
    private readonly string _text;

    public BulletPoint(string text)
    {
        _text = StripHtmlTags(text);
    }

    public void Compose(IContainer container)
    {
        container.Row(row =>
        {
            row.ConstantItem(8).PaddingTop(3).Column(col =>
            {
                col.Item().Width(3).Height(3).Background("#000000");
            });

            row.RelativeItem().Text(_text)
                .FontSize(10)
                .LineHeight(1.3f);
        });
    }

    private static string StripHtmlTags(string html)
    {
        if (string.IsNullOrEmpty(html))
            return string.Empty;

        // Simple HTML tag removal
        return System.Text.RegularExpressions.Regex.Replace(html, "<[^>]*>", "").Trim();
    }
}
