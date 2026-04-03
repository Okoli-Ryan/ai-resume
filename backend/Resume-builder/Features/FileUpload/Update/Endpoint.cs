using Carter;
using Resume_builder.Common;

namespace Resume_builder.Features.FileUpload.Update;

public class UpdateFileUploadEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGroup("file-upload")
            .WithTags("FileUpload")
            .MapPut("{id}", async (
                string id,
                UpdateFileUploadRequest request,
                UpdateFileUploadValidator validator,
                UpdateFileUploadHandler handler,
                CancellationToken cancellationToken) =>
            {
                var validationError = await validator.ValidateRequest(request);
                if (validationError != null)
                    return Results.BadRequest(validationError);

                var response = await handler.Handle(new UpdateFileUploadCommand(id, request), cancellationToken);
                return response.GetResult();
            });
    }
}
