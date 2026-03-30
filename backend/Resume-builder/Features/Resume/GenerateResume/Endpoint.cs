using Carter;
using Resume_builder.Common;
using Resume_builder.Features.Resume.Common;
using Resume_builder.Infrastructure.Services.AIChatClient.Common;

namespace Resume_builder.Features.Resume.GenerateResume;

public class GenerateResumeEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        var endpoint = app
            .MapGroup(ResumeConstants.ResumeMapGroupName)
            .WithTags(ResumeConstants.ResumeMapGroupTag).RequireAuthorization();
        
        endpoint.MapPost("generate/{resumeId}", async (
            string resumeId,
            ResumeAdditionalInfo additionalInfo,
            GenerateResumeHandler handler,
            CancellationToken cancellationToken
        ) =>
        {
            var response = await handler.Handle(new GenerateResumeCommand(resumeId, additionalInfo), cancellationToken);

            return response.GetResult();
        });
    }
}