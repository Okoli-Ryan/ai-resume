using System.Text.Json;
using Microsoft.Extensions.AI;
using Resume_builder.Common;
using Resume_builder.Features.Resume;
using Resume_builder.Infrastructure.Services.AIChatClient.Common;

namespace Resume_builder.Infrastructure.Services.AIChatClient.OpenAI;

public partial class OpenAiChatClient
{
    public async Task<AIResponse<string>> EnhanceBulletPoint(EnhanceBulletPointRequest request,
        CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }

    public async Task<AIResponse<EnhanceBulletPointsResponse?>> EnhanceBulletPoints(EnhanceTypes enhanceType,
        EnhanceBulletPointsRequest request,
        CancellationToken cancellationToken)
    {
        var inputPrompt = PromptBuilder.BuildEnhanceWorkExperienceBulletPointPrompt(request);

        var chatHistory = new List<ChatMessage>();


        switch (enhanceType)
        {
            case EnhanceTypes.Project:
                chatHistory.Add(new ChatMessage(ChatRole.System, SystemPrompts.EnhanceProjectBulletPointsSystemPrompt));
                break;
            case EnhanceTypes.Experience:
                chatHistory.Add(new ChatMessage(ChatRole.System,
                    SystemPrompts.EnhanceExperienceBulletPointsSystemPrompt));
                break;
            default:
                throw new ApplicationException("Invalid enhance type");
        }


        chatHistory.Add(new ChatMessage(ChatRole.User, inputPrompt));

        var response = await _chatClient.GetResponseAsync<EnhanceBulletPointsResponse>(chatHistory,
            JsonSerializerOptions.Default, null, true, cancellationToken);

        return new AIResponse<EnhanceBulletPointsResponse?>
        {
            PromptUsage = response.Usage?.TotalTokenCount,
            Response = response.Result
        };
    }

    public async Task<AIResponse<GenerateResumeResponse?>> GenerateResume(ResumeEntity resume,
        ResumeAdditionalInfo? additionalInfo, CancellationToken cancellationToken)
    {
        var prompt = PromptBuilder.BuildGenerateResumePrompt(resume, additionalInfo);

        throw new NotImplementedException();
    }

    public async Task<AIResponse<EnhanceSummaryResponse>> EnhanceSummary(string summary,
        ResumeAdditionalInfo? additionalInfo, CancellationToken cancellationToken)
    {
        var inputPrompt = PromptBuilder.BuildEnhanceSummaryPrompt(summary, additionalInfo);

        var chatHistory = new List<ChatMessage>();

        chatHistory.Add(new ChatMessage(ChatRole.System, SystemPrompts.GenerateSummarySystemPrompt));

        chatHistory.Add(new ChatMessage(ChatRole.User, inputPrompt));

        var response = await _chatClient.GetResponseAsync<EnhanceSummaryResponse>(chatHistory,
            JsonSerializerOptions.Default, null, true, cancellationToken);

        return new AIResponse<EnhanceSummaryResponse>
        {
            PromptUsage = response.Usage?.TotalTokenCount,
            Response = response.Result
        };
    }


    public async Task<AIResponse<List<EnhanceSkillsResponse>>> EnhanceSkills(List<string> skills,
        ResumeAdditionalInfo? additionalInfo, CancellationToken cancellationToken)
    {
        var inputPrompt = PromptBuilder.BuildEnhanceSkillsPrompt(skills, additionalInfo);

        var chatHistory = new List<ChatMessage>();

        chatHistory.Add(new ChatMessage(ChatRole.System, SystemPrompts.EnhanceSkillsSystemPrompt));

        chatHistory.Add(new ChatMessage(ChatRole.User, inputPrompt));

        var response = await _chatClient.GetResponseAsync<List<EnhanceSkillsResponse>>(chatHistory,
            JsonSerializerOptions.Default, null, true, cancellationToken);

        return new AIResponse<List<EnhanceSkillsResponse>>
        {
            PromptUsage = response.Usage?.TotalTokenCount,
            Response = response.Result
        };
    }

    public async Task<AIResponse<ParsedResumeResponse>> ParseResume(string rawText, CancellationToken cancellationToken)
    {
        var inputPrompt = PromptBuilder.BuildParseResumePrompt(rawText);
        
        var chatHistory = new List<ChatMessage>();

        chatHistory.Add(new ChatMessage(ChatRole.System, SystemPrompts.ParseResumeSystemPrompt));
        
        chatHistory.Add(new ChatMessage(ChatRole.User, inputPrompt));
        
        var response = await _chatClient.GetResponseAsync<ParsedResumeResponse>(
            chatHistory,
            JsonSerializerOptions.Default,
            new ChatOptions {Temperature = 0.3f},
            true,
            cancellationToken);

        return new AIResponse<ParsedResumeResponse>
        {
            PromptUsage = response.Usage?.TotalTokenCount,
            Response = response.Result
        };
    }
}