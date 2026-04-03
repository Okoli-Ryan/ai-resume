using Carter;
using Resume_builder.Common;

namespace Resume_builder.Features.FileUpload.GetByResumeId;

public class GetFileUploadsByResumeIdEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGroup("file-upload")
            .WithTags("FileUpload")
            .MapGet("resume/{resumeId}", async (
                string resumeId,
                GetFileUploadsByResumeIdHandler handler,
                CancellationToken cancellationToken) =>
            {
                var response = await handler.Handle(new GetFileUploadsByResumeIdQuery(resumeId), cancellationToken);
                return response.GetResult();
            });
    }
}
