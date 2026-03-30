using Carter;
using Resume_builder.Common;
using Resume_builder.Features.Resume.Common;

namespace Resume_builder.Features.Resume.EnhanceSkills;

public class EnhanceSkillsEndpoint : ICarterModule
{
    
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        
        var endpoint = app.MapGroup(ResumeConstants.ResumeMapGroupName).WithTags(ResumeConstants.ResumeMapGroupTag)
            .RequireAuthorization();  
        
        endpoint.MapPost("enhance/skills", async (
            EnhanceSkillsCommand command,
            EnhanceSkillsHandler handler,
            CancellationToken cancellationToken
        ) =>
        {
            var response = await handler.Handle(command, cancellationToken);

            return response.GetResult();
        });
    }
}