using QuestPDF.Fluent;
using QuestPDF.Infrastructure;
using Resume_builder.Features.Resume.Common;

namespace Resume_builder.Features.PdfGeneration.Components;

public class ProjectsSection : IComponent
{
    private readonly ResumeDto _resume;

    public ProjectsSection(ResumeDto resume)
    {
        _resume = resume;
    }

    public void Compose(IContainer container)
    {
        var projects = _resume.Projects;

        if (projects == null || projects.Count == 0)
            return;

        container.Column(column =>
        {
            column.Item().Component(new SectionHeader("Projects"));

            foreach (var project in projects)
            {
                column.Item().PaddingBottom(6).Column(projColumn =>
                {
                    // Project Name row (with optional link styling)
                    projColumn.Item().Row(row =>
                    {
                        var projectName = project.Name?.ToUpper() ?? string.Empty;

                        if (!string.IsNullOrEmpty(project.Link) && IsValidLink(project.Link))
                        {
                            row.RelativeItem().Hyperlink(project.Link).Text(projectName)
                                .FontSize(10)
                                .Bold()
                                .FontColor("#2563eb")
                                .Underline();
                        }
                        else
                        {
                            row.RelativeItem().Text(projectName)
                                .FontSize(10)
                                .Bold();
                        }
                    });

                    // Bullet points
                    if (project.BulletPoints != null && project.BulletPoints.Count > 0)
                    {
                        projColumn.Item().PaddingTop(4).Column(bpColumn =>
                        {
                            foreach (var bulletPoint in project.BulletPoints)
                            {
                                bpColumn.Item().PaddingBottom(2).Component(new BulletPoint(bulletPoint.Text));
                            }
                        });
                    }
                });
            }
        });
    }

    private static bool IsValidLink(string url)
    {
        return Uri.TryCreate(url, UriKind.Absolute, out var uriResult)
               && (uriResult.Scheme == Uri.UriSchemeHttp || uriResult.Scheme == Uri.UriSchemeHttps);
    }
}
