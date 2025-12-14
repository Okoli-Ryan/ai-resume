using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using Resume_builder.Features.Resume.Common;

namespace Resume_builder.Features.PdfGeneration.Components;

public class PersonalInfoSection : IComponent
{
    private static readonly string HyperlinkColor = Colors.Blue.Medium; // Bright blue
    private readonly ResumeDto _resume;

    public PersonalInfoSection(ResumeDto resume)
    {
        _resume = resume;
    }

    public void Compose(IContainer container)
    {
        container.Column(column =>
        {
            // Name and Role
            var nameText = _resume.UserName ?? string.Empty;
            if (!string.IsNullOrEmpty(_resume.Role)) nameText += $" - {_resume.Role}";

            column.Item().AlignCenter().Text(nameText)
                .FontSize(18)
                .Bold();

            // Contact Information
            var contactElements = new List<Action<TextDescriptor>>();

            if (!string.IsNullOrEmpty(_resume.Address))
            {
                var address = _resume.Address;
                contactElements.Add(txt =>
                {
                    txt.Span(address)
                        .FontSize(10);
                });
            }

            if (!string.IsNullOrEmpty(_resume.PhoneNumber))
            {
                var phone = _resume.PhoneNumber;
                var phoneHref = $"tel:{phone}";
                contactElements.Add(txt =>
                {
                    txt.Hyperlink(phone, phoneHref)
                        .FontSize(10)
                        .FontColor(HyperlinkColor);
                });
            }

            if (!string.IsNullOrEmpty(_resume.Email))
            {
                var email = _resume.Email;
                contactElements.Add(txt =>
                {
                    txt.Hyperlink(email, $"mailto:{email}")
                        .FontSize(10)
                        .FontColor(HyperlinkColor);
                });
            }

            if (!string.IsNullOrEmpty(_resume.LinkedinUrl))
            {
                var url = _resume.LinkedinUrl;
                contactElements.Add(txt =>
                {
                    txt.Hyperlink("Linkedin", url)
                        .FontSize(10)
                        .FontColor(HyperlinkColor);
                });
            }

            if (!string.IsNullOrEmpty(_resume.GithubUrl))
            {
                var url = _resume.GithubUrl;
                contactElements.Add(txt =>
                {
                    txt.Hyperlink("Github", url)
                        .FontSize(10)
                        .FontColor(HyperlinkColor);
                });
            }

            if (!string.IsNullOrEmpty(_resume.PortfolioUrl))
            {
                var url = _resume.PortfolioUrl;
                contactElements.Add(txt =>
                {
                    txt.Hyperlink("Portfolio", url)
                        .FontSize(10)
                        .FontColor(HyperlinkColor);
                });
            }

            if (contactElements.Any())
                column.Item().PaddingTop(8).AlignCenter().Text(text =>
                {
                    for (var i = 0; i < contactElements.Count; i++)
                    {
                        contactElements[i](text);
                        if (i < contactElements.Count - 1) text.Span(" | ").FontSize(10);
                    }
                });
        });
    }
}