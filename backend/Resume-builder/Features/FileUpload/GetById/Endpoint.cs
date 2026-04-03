using Carter;
using Resume_builder.Common;

namespace Resume_builder.Features.FileUpload.GetById;

public class GetFileUploadByIdEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGroup("file-upload")
            .WithTags("FileUpload")
            .MapGet("{id}", async (
                string id,
                GetFileUploadByIdHandler handler,
                CancellationToken cancellationToken) =>
            {
                var response = await handler.Handle(new GetFileUploadByIdQuery(id), cancellationToken);
                return response.GetResult();
            });
    }
}
