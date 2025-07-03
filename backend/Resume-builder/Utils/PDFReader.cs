using System.Text;
using iText.Kernel.Pdf;
using iText.Kernel.Pdf.Annot;
using iText.Kernel.Pdf.Canvas.Parser;
using iText.Kernel.Pdf.Canvas.Parser.Listener;

namespace Resume_builder.Utils;

public static class PdfLinkExtractor
{
    public static string ExtractTextWithLinksFromBase64(string base64Pdf)
    {
        if (!IsValidBase64(base64Pdf))
            throw new ArgumentException("Invalid Base64 string");

        byte[] pdfBytes = Convert.FromBase64String(base64Pdf);
        var output = new StringBuilder();

        using var reader = new PdfReader(new MemoryStream(pdfBytes));
        using var pdf = new PdfDocument(reader);

        for (int i = 1; i <= pdf.GetNumberOfPages(); i++)
        {
            var page = pdf.GetPage(i);
            var strategy = new LocationTextExtractionStrategy();
            string pageText = PdfTextExtractor.GetTextFromPage(page, strategy);

            output.AppendLine(pageText.Trim());

            // Extract link annotations
            var annotations = page.GetAnnotations();

            foreach (var annot in annotations)
            {
                if (annot.GetSubtype().Equals(PdfName.Link))
                {
                    var linkAnnot = (PdfLinkAnnotation)annot;
                    var action = linkAnnot.GetAction();

                    if (action != null && action.Get(PdfName.URI) != null)
                    {
                        string uri = action.GetAsString(PdfName.URI).ToString();
                        output.AppendLine($"[Link → {uri}]");
                    }
                }
            }


            output.AppendLine(); // separate pages
            output.AppendLine($"End of page {i}");
        }

        return output.ToString().Trim();
    }

    private static bool IsValidBase64(string base64)
    {
        if (string.IsNullOrWhiteSpace(base64))
            return false;

        base64 = base64.Trim();
        if (base64.Length % 4 != 0)
            return false;

        try
        {
            _ = Convert.FromBase64String(base64);
            return true;
        }
        catch
        {
            return false;
        }
    }
}