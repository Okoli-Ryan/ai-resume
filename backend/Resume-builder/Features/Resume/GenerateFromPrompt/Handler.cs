using System.Net;
using Resume_builder.Common;
using Resume_builder.Features.Resume.Common;
using Resume_builder.Infrastructure.Persistence.Data;
using Resume_builder.Infrastructure.Services.AIChatClient;
using Resume_builder.Infrastructure.Services.ClaimService;

namespace Resume_builder.Features.Resume.GenerateFromPrompt;

public class GenerateFromPromptHandler(
    IClaimsService claimsService,
    IAIChatClient chatClient,
    AppDbContext db) : IResponseHandler<GenerateFromPromptCommand, ResumeDto>
{
    public async Task<Response<ResumeDto>> Handle(GenerateFromPromptCommand command,
        CancellationToken cancellationToken)
    {
        var userId = claimsService.GetUserId();

        if (userId is null)
            return Response<ResumeDto>.Fail(HttpStatusCode.Unauthorized, "Unauthorized");

        var response =
            await chatClient.GenerateResumeFromPrompt(command.Prompt, command.AdditionalInfo, cancellationToken);

        if (response.Response is null)
            return Response<ResumeDto>.Fail(HttpStatusCode.NotFound, "Unable to parse resume.");

        var resume = response.Response;

        var newResume = resume.ToResumeEntity(userId);

        db.Add(newResume);
        await db.SaveChangesAsync(cancellationToken);

        newResume.MapChildEntities(resume, userId);
        await db.SaveChangesAsync(cancellationToken);

        newResume.AddBulletPoints(resume);
        await db.SaveChangesAsync(cancellationToken);

        return Response<ResumeDto>.Success(newResume.ToDto());
    }
}