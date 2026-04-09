using System.Net;
using Resume_builder.Common;
using Resume_builder.Features.Resume.Common;
using Resume_builder.Infrastructure.Persistence.Data;
using Resume_builder.Infrastructure.Services.AIChatClient;
using Resume_builder.Infrastructure.Services.ClaimService;
using Resume_builder.Utils.PDF;

namespace Resume_builder.Features.Resume.ImportResume;

public class ImportResumeHandler(
    IClaimsService claimsService,
    IAIChatClient chatClient,
    AppDbContext db) : IResponseHandler<ImportResumeCommand, ResumeDto>
{
    public async Task<Response<ResumeDto>> Handle(ImportResumeCommand command,
        CancellationToken cancellationToken)
    {
        var userId = claimsService.GetUserId();

        if (userId is null)
            return Response<ResumeDto>.Fail(HttpStatusCode.Unauthorized, "Unauthorized");

        string rawText;

        try
        {
            rawText = PdfLinkExtractor.ExtractTextWithLinksFromBase64(command.Base64String);
        }
        catch
        {
            return Response<ResumeDto>.Fail(HttpStatusCode.BadRequest, "Unable to parse resume.");
        }

        var response = await chatClient.ParseResume(rawText, command.additionalInfo, cancellationToken);

        if (response.Response is null)
            return Response<ResumeDto>.Fail(HttpStatusCode.BadRequest, "Unable to parse resume.");

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