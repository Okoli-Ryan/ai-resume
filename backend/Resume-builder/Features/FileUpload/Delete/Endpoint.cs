using Carter;
using Resume_builder.Common;

namespace Resume_builder.Features.FileUpload.Delete;

public class DeleteFileUploadEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGroup("file-upload")
            .WithTags("FileUpload")
            .MapDelete("{id}", async (
                string id,
                DeleteFileUploadHandler handler,
                CancellationToken cancellationToken) =>
            {
                var response = await handler.Handle(new DeleteFileUploadCommand(id), cancellationToken);
                return response.GetResult();
            });
    }
}
