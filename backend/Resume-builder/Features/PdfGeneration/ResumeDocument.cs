using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using Resume_builder.Features.PdfGeneration.Components;
using Resume_builder.Features.Resume.Common;

namespace Resume_builder.Features.PdfGeneration;

public class ResumeDocument : IDocument
{
    private readonly ResumeDto _resume;
    private static readonly string[] DefaultResumeOrder = ["summary", "workExperience", "education", "projects", "skills"];

    public ResumeDocument(ResumeDto resume)
    {
        _resume = resume;
    }

    public DocumentMetadata GetMetadata() => DocumentMetadata.Default;

    public DocumentSettings GetSettings() => DocumentSettings.Default;

    public void Compose(IDocumentContainer container)
    {
        container.Page(page =>
        {
            page.Size(PageSizes.A4);
            page.MarginTop(48);
            page.MarginBottom(16);
            page.MarginHorizontal(64);

            // Use Times New Roman font family
            page.DefaultTextStyle(style => style
                .FontFamily("Times New Roman")
                .FontSize(10)
                .LineHeight(1.3f));

            page.Content().Column(column =>
            {
                // Personal Info section (always first)
                column.Item().Component(new PersonalInfoSection(_resume));

                // Add spacing before other sections
                column.Item().PaddingTop(12);

                // Get section order from resume or use default
                var order = !string.IsNullOrEmpty(_resume.Order)
                    ? _resume.Order.Split(',').Select(s => s.Trim()).ToArray()
                    : DefaultResumeOrder;

                // Render sections in order
                foreach (var sectionKey in order)
                {
                    var component = GetSectionComponent(sectionKey);
                    if (component != null)
                    {
                        column.Item().Component(component);
                    }
                }
            });
        });
    }

    private IComponent? GetSectionComponent(string sectionKey)
    {
        return sectionKey.ToLowerInvariant() switch
        {
            "summary" => new SummarySection(_resume),
            "workexperience" => new WorkExperienceSection(_resume),
            "education" => new EducationSection(_resume),
            "projects" => new ProjectsSection(_resume),
            "skills" => new SkillsSection(_resume),
            _ => null
        };
    }
}
