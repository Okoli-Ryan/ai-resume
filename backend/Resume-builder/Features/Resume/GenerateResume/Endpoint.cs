using Carter;
using Resume_builder.Common;
using Resume_builder.Features.Resume.Common;
using Resume_builder.Infrastructure.Persistence.Data;
using Resume_builder.Infrastructure.Repositories.ResumeRepository;
using Resume_builder.Infrastructure.Services.AIChatClient;
using Resume_builder.Infrastructure.Services.AIChatClient.Common;
using Resume_builder.Infrastructure.Services.ClaimService;

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
            IAIChatClient chatClient,
            AppDbContext db,
            IClaimsService claimsService,
            IHostEnvironment env,
            IResumeRepository resumeRepository,
            CancellationToken cancellationToken
        ) =>
        {
            var handler = new GenerateResumeHandler(db, claimsService, env, resumeRepository, chatClient);
            var response = await handler.Handle(new GenerateResumeCommand(resumeId, additionalInfo), cancellationToken);

            return response.GetResult();
        });
    }
}