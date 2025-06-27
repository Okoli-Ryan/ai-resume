using System.Text;
using System.Text.Json;
using System.Text.Json.Schema;
using Microsoft.Extensions.AI;
using Resume_builder.Features.Resume;
using Resume_builder.Infrastructure.Services.AIChatClient.Common;

namespace Resume_builder.Infrastructure.Services.AIChatClient.Ollama;

public partial class OllamaChatClient
{
    public async Task<AIResponse<GenerateResumeResponse?>> GenerateResume(ResumeEntity resume,
        ResumeAdditionalInfo? additionalInfo, CancellationToken cancellationToken)
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


        if ((resume.Skills ?? []).Count != 0)
        {
            inputPrompt.AppendLine("Skills:");
            var skillsList = resume.Skills ?? [];

            foreach (var skillItem in skillsList)
            {
                inputPrompt.AppendLine($"Category: {skillItem.Group}");
                inputPrompt.AppendLine(skillItem.Skills);
            }
        }

        var payload = new OllamaChatRequest
        {
            Model = model,
            Messages =
            [
                new OllamaChatMessage
                {
                    Role = ChatRole.System.Value.ToLower(), Content = AIChatConstants.GenerateResumeSystemPrompt
                },
                new OllamaChatMessage { Role = ChatRole.User.Value.ToLower(), Content = inputPrompt.ToString() }
            ],
            Stream = false,
            Format = JsonSerializerOptions.Default.GetJsonSchemaAsNode(typeof(GenerateResumeResponse))
        };


        var response = await GetChatResponse(payload, cancellationToken);

        return new AIResponse<GenerateResumeResponse?>
        {
            PromptUsage = response.Usage?.TotalTokenCount,
            Response = JsonSerializer.Deserialize<GenerateResumeResponse>(response.Text)
        };
    }

    public async Task<AIResponse<EnhanceWorkExperienceBulletPointsResponse?>> EnhanceWorkExperienceBulletPoints(
        EnhanceWorkExperienceBulletPointsRequest request,
        CancellationToken cancellationToken)
    {
        var inputPrompt = new StringBuilder();

        inputPrompt.AppendLine("Bullet Points:");
        foreach (var point in request.BulletPoints) inputPrompt.AppendLine($"- {point}");

        if (!string.IsNullOrWhiteSpace(request.Role))
            inputPrompt.AppendLine($"\nRole: {request.Role}");

        if (!string.IsNullOrWhiteSpace(request.Tags))
            inputPrompt.AppendLine($"Tags: {request.Tags}");

        var payload = new OllamaChatRequest
        {
            Model = model,
            Messages =
            [
                new OllamaChatMessage
                {
                    Role = ChatRole.System.Value.ToLower(), Content = AIChatConstants.EnhanceBulletPointListSystemPrompt
                },
                new OllamaChatMessage { Role = ChatRole.User.Value.ToLower(), Content = inputPrompt.ToString() }
            ],
            Stream = false,
            Format = JsonSerializerOptions.Default.GetJsonSchemaAsNode(
                typeof(EnhanceWorkExperienceBulletPointsResponse))
        };

        var response = await GetChatResponse(payload, cancellationToken);

        return new AIResponse<EnhanceWorkExperienceBulletPointsResponse?>
        {
            PromptUsage = response.Usage?.TotalTokenCount,
            Response = JsonSerializer.Deserialize<EnhanceWorkExperienceBulletPointsResponse>(response.Text)
        };
    }


    public async Task<AIResponse<string>> EnhanceBulletPoint(EnhanceBulletPointRequest request,
        CancellationToken cancellationToken)
    {
        var inputPrompt = new StringBuilder();

        inputPrompt.AppendLine(request.BulletPoint);

        if (!string.IsNullOrWhiteSpace(request.Role))
            inputPrompt.AppendLine($"Role: {request.Role}");

        if (!string.IsNullOrWhiteSpace(request.Tags))
            inputPrompt.AppendLine($"Tags: {request.Tags}");

        var payload = new OllamaChatRequest
        {
            Model = model,
            Messages =
            [
                new OllamaChatMessage
                {
                    Role = ChatRole.System.Value.ToLower(), Content = AIChatConstants.EnhanceBulletPointSystemPrompt
                },
                new OllamaChatMessage { Role = ChatRole.User.Value.ToLower(), Content = inputPrompt.ToString() }
            ],
            Stream = false
        };

        var response = await GetChatResponse(payload, cancellationToken);

        return new AIResponse<string>
        {
            PromptUsage = response.Usage?.TotalTokenCount,
            Response = response.Text
        };
    }

    private async Task<ChatResponse> GetChatResponse(object request, CancellationToken cancellationToken)
    {
        var httpResponse = await httpClient.PostAsJsonAsync("/api/chat", request, cancellationToken);

        if (!httpResponse.IsSuccessStatusCode)
            throw new Exception("Failed to get response from API");

        var responseData = await httpResponse.Content.ReadFromJsonAsync<OllamaResponse>(cancellationToken);

        if (responseData is null)
            throw new Exception("Failed to get response from API");

        var response = new ChatResponse
        {
            Messages =
            [
                new ChatMessage(ChatRole.Assistant,
                    responseData.Message.Content)
            ],
            CreatedAt = responseData.CreatedAt,
            Usage = new UsageDetails
            {
                InputTokenCount = responseData.PromptEvalCount,
                OutputTokenCount = responseData.EvalCount,
                TotalTokenCount = responseData.EvalCount + responseData.PromptEvalCount
            }
        };

        return response;
    }
}