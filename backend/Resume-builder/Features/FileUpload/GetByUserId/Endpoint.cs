using Carter;
using Resume_builder.Common;

namespace Resume_builder.Features.FileUpload.GetByUserId;

public class GetFileUploadsByUserIdEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGroup("file-upload")
            .WithTags("FileUpload")
            .MapGet("user", async (
                GetFileUploadsByUserIdHandler handler,
                CancellationToken cancellationToken) =>
            {
                var response = await handler.Handle(new GetFileUploadsByUserIdQuery(), cancellationToken);
                return response.GetResult();
            });
    }
}
