using System.Text;
using Resume_builder.Features.Resume;

namespace Resume_builder.Infrastructure.Services.AIChatClient.Common;

public static class PromptBuilder
{

    private static void AppendAdditionalInfo(StringBuilder inputPrompt, ResumeAdditionalInfo additionalInfo)
    {
        if (!string.IsNullOrEmpty(additionalInfo?.JobDescription))
        {
            inputPrompt.AppendLine("Job Description:");
            inputPrompt.AppendLine(additionalInfo.JobDescription);
            inputPrompt.AppendLine();
        }

        if (!string.IsNullOrEmpty(additionalInfo?.Role))
        {
            inputPrompt.AppendLine("Role:");
            inputPrompt.AppendLine(additionalInfo.Role);
            inputPrompt.AppendLine();
        }

        if (!string.IsNullOrEmpty(additionalInfo?.Tags))
        {
            inputPrompt.AppendLine("Tags:");
            inputPrompt.AppendLine(additionalInfo.Tags);
            inputPrompt.AppendLine();
        }
    }
    
    public static string BuildEnhanceSkillsPrompt(List<string> skills, ResumeAdditionalInfo? additionalInfo)
    {
        var inputPrompt = new StringBuilder();

        inputPrompt.AppendLine("Skills:\n");

        foreach (var skill in skills) inputPrompt.Append($"-{skill}\n");

        if (!string.IsNullOrWhiteSpace(additionalInfo?.Role))
            inputPrompt.AppendLine($"Role: {additionalInfo.Role}");

        if (!string.IsNullOrWhiteSpace(additionalInfo?.JobDescription))
            inputPrompt.AppendLine($"Role: {additionalInfo.JobDescription}");

        if (!string.IsNullOrWhiteSpace(additionalInfo?.Tags))
            inputPrompt.AppendLine($"Tags: {additionalInfo.Tags}");

        return inputPrompt.ToString();
    }


    public static string BuildEnhanceSummaryPrompt(string summary, ResumeAdditionalInfo? additionalInfo)
    {
        var inputPrompt = new StringBuilder();

        inputPrompt.AppendLine($"Summary: {summary}");

        if (!string.IsNullOrWhiteSpace(additionalInfo?.Role))
            inputPrompt.AppendLine($"Role: {additionalInfo.Role}");

        if (!string.IsNullOrWhiteSpace(additionalInfo?.JobDescription))
            inputPrompt.AppendLine($"Role: {additionalInfo.JobDescription}");

        if (!string.IsNullOrWhiteSpace(additionalInfo?.Tags))
            inputPrompt.AppendLine($"Tags: {additionalInfo.Tags}");

        return inputPrompt.ToString();
    }


    public static string BuildEnhanceBulletPointPrompt(EnhanceBulletPointRequest request)
    {
        var inputPrompt = new StringBuilder();

        inputPrompt.AppendLine(request.BulletPoint);

        if (!string.IsNullOrWhiteSpace(request.Role))
            inputPrompt.AppendLine($"Role: {request.Role}");

        if (!string.IsNullOrWhiteSpace(request.Tags))
            inputPrompt.AppendLine($"Tags: {request.Tags}");

        return inputPrompt.ToString();
    }

    public static string BuildParseResumePrompt(string rawText, ResumeAdditionalInfo additionalInfo)
    {
        var inputPrompt = new StringBuilder();

        inputPrompt.Append("Resume Raw Text: \n");
        inputPrompt.AppendLine(rawText);

        AppendAdditionalInfo(inputPrompt, additionalInfo);

        return inputPrompt.ToString();
    }
    
    public static string BuildGenerateResumeFromPrompt(string prompt, ResumeAdditionalInfo additionalInfo)
    {
        var inputPrompt = new StringBuilder();

        inputPrompt.Append("User input: \n");
        inputPrompt.AppendLine(prompt);

        AppendAdditionalInfo(inputPrompt, additionalInfo);

        return inputPrompt.ToString();
    }
    
    public static string BuildEnhanceWorkExperienceBulletPointPrompt(EnhanceBulletPointsRequest request)
    {
        var inputPrompt = new StringBuilder();

        inputPrompt.AppendLine("Bullet Points:");
        foreach (var point in request.BulletPoints) inputPrompt.AppendLine($"- {point}");

        if (!string.IsNullOrWhiteSpace(request.Role))
            inputPrompt.AppendLine($"\nRole: {request.Role}");

        if (!string.IsNullOrWhiteSpace(request.JobDescription))
            inputPrompt.AppendLine($"\nJob Description: {request.JobDescription}");

        if (!string.IsNullOrWhiteSpace(request.Tags))
            inputPrompt.AppendLine($"Tags: {request.Tags}");

        return inputPrompt.ToString();
    }


    public static string BuildGenerateResumePrompt(ResumeEntity resume, ResumeAdditionalInfo? additionalInfo)
    {
        var inputPrompt = new StringBuilder();

        if (!string.IsNullOrEmpty(resume.JobRole))
        {
            inputPrompt.AppendLine("Job Role:");
            inputPrompt.AppendLine(resume.JobRole);
            inputPrompt.AppendLine();
        }

        if (!string.IsNullOrEmpty(additionalInfo?.JobDescription))
        {
            inputPrompt.AppendLine("Job Description:");
            inputPrompt.AppendLine(additionalInfo.JobDescription);
            inputPrompt.AppendLine();
        }

        if (!string.IsNullOrEmpty(additionalInfo?.Tags))
        {
            inputPrompt.AppendLine("Tags:");
            inputPrompt.AppendLine(additionalInfo.Tags);
            inputPrompt.AppendLine();
        }

        if (!string.IsNullOrEmpty(resume.TextSummary))
        {
            inputPrompt.AppendLine("Summary:");
            inputPrompt.AppendLine(resume.TextSummary);
            inputPrompt.AppendLine();
        }

        if ((resume.WorkExperience ?? []).Count != 0)
        {
            inputPrompt.AppendLine("Work Experience:");

            var workExperienceList = resume.WorkExperience ?? [];
            foreach (var workExperience in workExperienceList)
            {
                inputPrompt.AppendLine();
                inputPrompt.Append($"Company Name: {workExperience.CompanyName};");
                inputPrompt.Append($"Start Time: {workExperience.StartDate:MMMM yyyy};");
                inputPrompt.Append(
                    $"End Time: {(workExperience.IsOngoing ? "Present" : workExperience.EndDate?.ToString("MMMM yyyy"))};");
                inputPrompt.Append($"Is Ongoing: {workExperience.IsOngoing.ToString()}");
                inputPrompt.Append($"WorkType: {workExperience.WorkType}");
                inputPrompt.Append($"CompanyLink: {workExperience.CompanyLink}");
                inputPrompt.Append($"Location: {workExperience.Location}");
                inputPrompt.Append($"Job Role: {workExperience.Title}");

                inputPrompt.AppendLine("- Bullet Points:");

                var bulletPoints = workExperience.BulletPoints;

                foreach (var bulletPoint in bulletPoints) inputPrompt.AppendLine(bulletPoint.Text);
            }

            inputPrompt.AppendLine();
        }


        if ((resume.Projects ?? []).Count != 0)
        {
            inputPrompt.AppendLine("Projects:");

            var projectList = resume.Projects ?? [];
            foreach (var project in projectList)
            {
                inputPrompt.AppendLine();
                inputPrompt.Append($"Project Name: {project.ProjectName};");
                inputPrompt.Append($"Project URL: {project.ProjectUrl};");

                inputPrompt.AppendLine("- Bullet Points:");

                var bulletPoints = project.BulletPoints;

                foreach (var bulletPoint in bulletPoints) inputPrompt.AppendLine(bulletPoint.Text);
            }

            inputPrompt.AppendLine();
        }


        if ((resume.Skills ?? []).Count == 0) return inputPrompt.ToString();


        inputPrompt.AppendLine("Skills:");
        var skillsList = resume.Skills ?? [];

        foreach (var skillItem in skillsList)
        {
            inputPrompt.AppendLine($"Category: {skillItem.Group}");
            inputPrompt.AppendLine(skillItem.Skills);
        }

        return inputPrompt.ToString();
    }
}