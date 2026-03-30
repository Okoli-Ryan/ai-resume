using Carter;
using Resume_builder.Common;
using Resume_builder.Features.Resume.Common;

namespace Resume_builder.Features.Resume.Create;

public class CreateResumeEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        var endpoint = app.MapGroup(ResumeConstants.ResumeMapGroupName)
            .WithTags(ResumeConstants.ResumeMapGroupTag)
            .RequireAuthorization();

        endpoint.MapPost("", async (
            CreateResumeCommand command,
            CreateResumeValidator validator,
            CreateResumeHandler handler,
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