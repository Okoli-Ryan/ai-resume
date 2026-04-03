using Carter;
using Resume_builder.Common;

namespace Resume_builder.Features.FileUpload.Create;

public class CreateFileUploadEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGroup("file-upload")
            .WithTags("FileUpload")
            .MapPost("", async (
                CreateFileUploadCommand command,
                CreateFileUploadValidator validator,
                CreateFileUploadHandler handler,
                CancellationToken cancellationToken) =>
            {
                var validationError = await validator.ValidateRequest(command);
                if (validationError != null)
                    return Results.BadRequest(validationError);

                var response = await handler.Handle(command, cancellationToken);
                return response.GetResult();
            });
    }
}
