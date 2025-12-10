using System.Text.Json;
using System.Text.Json.Schema;
using Microsoft.Extensions.AI;
using Resume_builder.Common;
using Resume_builder.Features.Resume;
using Resume_builder.Infrastructure.Services.AIChatClient.Common;

namespace Resume_builder.Infrastructure.Services.AIChatClient.Ollama;

public partial class OllamaChatClient
{
    public async Task<AIResponse<GenerateResumeResponse?>> GenerateResume(ResumeEntity resume,
        ResumeAdditionalInfo? additionalInfo, CancellationToken cancellationToken)
    {
        var prompt = PromptBuilder.BuildGenerateResumePrompt(resume, additionalInfo);

        var payload = new OllamaChatRequest
        {
            Model = model,
            Messages =
            [
                new OllamaChatMessage
                {
                    Role = ChatRole.System.Value.ToLower(), Content = SystemPrompts.GenerateResumeSystemPrompt
                },
                new OllamaChatMessage { Role = ChatRole.User.Value.ToLower(), Content = prompt }
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

    public async Task<AIResponse<EnhanceSummaryResponse>> EnhanceSummary(string summary,
        ResumeAdditionalInfo? additionalInfo, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }

    public async Task<AIResponse<List<EnhanceSkillsResponse>>> EnhanceSkills(List<string> skills,
        ResumeAdditionalInfo? additionalInfo, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }

    public async Task<AIResponse<ParsedResumeResponse>> ParseResume(string rawText, ResumeAdditionalInfo additionalInfo,
        CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }

    public async Task<AIResponse<EnhanceBulletPointsResponse?>> EnhanceBulletPoints(
        EnhanceTypes enhanceType,
        EnhanceBulletPointsRequest request,
        CancellationToken cancellationToken)
    {
        var inputPrompt = PromptBuilder.BuildEnhanceWorkExperienceBulletPointPrompt(request);

        var payload = new OllamaChatRequest
        {
            Model = model,
            Messages =
            [
                new OllamaChatMessage
                {
                    Role = ChatRole.System.Value.ToLower(),
                    Content = SystemPrompts.EnhanceExperienceBulletPointsSystemPrompt
                },
                new OllamaChatMessage { Role = ChatRole.User.Value.ToLower(), Content = inputPrompt }
            ],
            Stream = false,
            Format = JsonSerializerOptions.Default.GetJsonSchemaAsNode(
                typeof(EnhanceBulletPointsResponse))
        };

        var response = await GetChatResponse(payload, cancellationToken);

        return new AIResponse<EnhanceBulletPointsResponse?>
        {
            PromptUsage = response.Usage?.TotalTokenCount,
            Response = JsonSerializer.Deserialize<EnhanceBulletPointsResponse>(response.Text)
        };
    }


    public async Task<AIResponse<string>> EnhanceBulletPoint(EnhanceBulletPointRequest request,
        CancellationToken cancellationToken)
    {
        var inputPrompt = PromptBuilder.BuildEnhanceBulletPointPrompt(request);

        var payload = new OllamaChatRequest
        {
            Model = model,
            Messages =
            [
                new OllamaChatMessage
                {
                    Role = ChatRole.System.Value.ToLower(), Content = SystemPrompts.EnhanceBulletPointSystemPrompt
                },
                new OllamaChatMessage { Role = ChatRole.User.Value.ToLower(), Content = inputPrompt }
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