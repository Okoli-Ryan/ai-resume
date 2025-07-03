using Carter;
using Resume_builder.Common;
using Resume_builder.Features.Resume.Common;
using Resume_builder.Infrastructure.Persistence.Data;
using Resume_builder.Infrastructure.Services.AIChatClient;
using Resume_builder.Infrastructure.Services.ClaimService;

namespace Resume_builder.Features.Resume.Import_Resume;

public class Endpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        var endpoint = app.MapGroup(ResumeConstants.ResumeMapGroupName).WithTags(ResumeConstants.ResumeMapGroupTag)
            .RequireAuthorization();

        endpoint.MapPost("/import", async (
            ImportResumeCommand command,
            IClaimsService claimsService,
            IAIChatClient chatClient,
            IHostEnvironment env,
            AppDbContext db,
            CancellationToken cancellationToken
        ) =>
        {
            var handler = new ImportResumeHandler(claimsService, chatClient, env, db);
            var response = await handler.Handle(command, cancellationToken);

            return response.GetResult();
        });
    }
}