using System.Text.RegularExpressions;

namespace Resume_builder.Features.PdfGeneration;

/// <summary>
/// Utility class for HTML text processing in PDF generation.
/// </summary>
public static partial class HtmlUtils
{
    /// <summary>
    /// Strips HTML tags from the given text.
    /// </summary>
    /// <param name="html">The HTML string to process.</param>
    /// <returns>Plain text with HTML tags removed.</returns>
    public static string StripHtmlTags(string? html)
    {
        if (string.IsNullOrEmpty(html))
            return string.Empty;

        return HtmlTagRegex().Replace(html, "").Trim();
    }

    [GeneratedRegex("<[^>]*>")]
    private static partial Regex HtmlTagRegex();
}
