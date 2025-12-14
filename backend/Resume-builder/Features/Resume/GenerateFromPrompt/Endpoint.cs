using Carter;
using Resume_builder.Common;
using Resume_builder.Features.Resume.Common;
using Resume_builder.Infrastructure.Persistence.Data;
using Resume_builder.Infrastructure.Services.AIChatClient;
using Resume_builder.Infrastructure.Services.ClaimService;

namespace Resume_builder.Features.Resume.GenerateFromPrompt;

public class GenerateResumeFromPromptEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        var endpoint = app.MapGroup(ResumeConstants.ResumeMapGroupName).WithTags(ResumeConstants.ResumeMapGroupTag)
            .RequireAuthorization();

        endpoint.MapPost("/generate-from-prompt", async (
            GenerateFromPromptCommand command,
            IClaimsService claimsService,
            IAIChatClient chatClient,
            IHostEnvironment env,
            AppDbContext db,
            CancellationToken cancellationToken
        ) =>
        {
            var handler = new GenerateFromPromptHandler(claimsService, chatClient, env, db);
            var response = await handler.Handle(command, cancellationToken);

            return response.GetResult();
        });
    }
}