using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using Resume_builder.Features.Resume.Common;

namespace Resume_builder.Features.PdfGeneration.Components;

public class PersonalInfoSection : IComponent
{
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
            if (!string.IsNullOrEmpty(_resume.Role))
            {
                nameText += $" - {_resume.Role}";
            }

            column.Item().AlignCenter().Text(nameText)
                .FontSize(18)
                .Bold();

            // Contact Information
            var contactItems = new List<string>();

            if (!string.IsNullOrEmpty(_resume.Address))
                contactItems.Add(_resume.Address);

            if (!string.IsNullOrEmpty(_resume.PhoneNumber))
                contactItems.Add(_resume.PhoneNumber);

            if (!string.IsNullOrEmpty(_resume.Email))
                contactItems.Add(_resume.Email);

            if (!string.IsNullOrEmpty(_resume.LinkedinUrl))
                contactItems.Add("LinkedIn");

            if (!string.IsNullOrEmpty(_resume.GithubUrl))
                contactItems.Add("GitHub");

            if (!string.IsNullOrEmpty(_resume.PortfolioUrl))
                contactItems.Add("Portfolio");

            if (contactItems.Any())
            {
                column.Item().PaddingTop(8).AlignCenter().Text(text =>
                {
                    for (int i = 0; i < contactItems.Count; i++)
                    {
                        text.Span(contactItems[i]).FontSize(10);
                        if (i < contactItems.Count - 1)
                        {
                            text.Span(" | ").FontSize(10);
                        }
                    }
                });
            }
        });
    }
}
