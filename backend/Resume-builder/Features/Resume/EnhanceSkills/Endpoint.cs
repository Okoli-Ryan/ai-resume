using Carter;
using Resume_builder.Common;
using Resume_builder.Features.Resume.Common;
using Resume_builder.Infrastructure.Services.AIChatClient;
using Resume_builder.Infrastructure.Services.ClaimService;

namespace Resume_builder.Features.Resume.EnhanceSkills;

public class EnhanceSkillsEndpoint : ICarterModule
{
    
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        
        var endpoint = app.MapGroup(ResumeConstants.ResumeMapGroupName).WithTags(ResumeConstants.ResumeMapGroupTag)
            .RequireAuthorization();  
        
        endpoint.MapPost("enhance/skills", async (
            EnhanceSkillsCommand command,
            IAIChatClient chatClient,
            IClaimsService claimsService,
            CancellationToken cancellationToken
        ) =>
        {
            var handler = new EnhanceSkillsHandler(claimsService, chatClient);
            var response = await handler.Handle(command, cancellationToken);

            return response.GetResult();
        });
    }
}