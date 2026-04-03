using Carter;
using Microsoft.AspNetCore.Mvc;
using Resume_builder.Common;

namespace Resume_builder.Features.FileUpload.UploadFile;

public class UploadFileEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGroup("file-upload")
            .WithTags("FileUpload")
            .MapPost("upload", async (
                HttpContext httpContext,
                [FromForm] string? resumeId,
                [FromForm] string? coverLetterId,
                UploadFileValidator validator,
                UploadFileHandler handler,
                CancellationToken cancellationToken) =>
            {
                var file = httpContext.Request.Form.Files.GetFile("file");

                var command = new UploadFileCommand
                {
                    File = file!,
                    ResumeId = resumeId,
                    CoverLetterId = coverLetterId
                };

                var validationError = await validator.ValidateRequest(command);
                if (validationError != null)
                    return Results.BadRequest(validationError);

                var response = await handler.Handle(command, cancellationToken);
                return response.GetResult();
            })
            .DisableAntiforgery();
    }
}
