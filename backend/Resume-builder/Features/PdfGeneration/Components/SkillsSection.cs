using QuestPDF.Fluent;
using QuestPDF.Infrastructure;
using Resume_builder.Features.Resume.Common;

namespace Resume_builder.Features.PdfGeneration.Components;

public class SkillsSection : IComponent
{
    private readonly ResumeDto _resume;

    public SkillsSection(ResumeDto resume)
    {
        _resume = resume;
    }

    public void Compose(IContainer container)
    {
        var skills = _resume.Skills;

        if (skills == null || skills.Count == 0)
            return;

        container.Column(column =>
        {
            column.Item().Component(new SectionHeader("Skills"));

            foreach (var skill in skills)
            {
                // Format skills with proper comma separation
                var skillsList = skill.Skills.Split(',')
                    .Select(s => s.Trim())
                    .Where(s => !string.IsNullOrEmpty(s));

                column.Item().PaddingBottom(4).Text(text =>
                {
                    text.Span(skill.Category.ToUpper() + ": ")
                        .FontSize(10)
                        .Bold();

                    text.Span(string.Join(", ", skillsList))
                        .FontSize(10);
                });
            }
        });
    }
}
