using Carter;
using Resume_builder.Common;
using Resume_builder.Features.Resume.Common;

namespace Resume_builder.Features.Resume.Import_Resume;

public class Endpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        var endpoint = app.MapGroup(ResumeConstants.ResumeMapGroupName).WithTags(ResumeConstants.ResumeMapGroupTag)
            .RequireAuthorization();

        endpoint.MapPost("/import", async (
            ImportResumeCommand command,
            ImportResumeHandler handler,
            CancellationToken cancellationToken
        ) =>
        {
            var response = await handler.Handle(command, cancellationToken);

            return response.GetResult();
        });
    }
}