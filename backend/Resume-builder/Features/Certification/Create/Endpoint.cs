using Carter;
using Resume_builder.Common;

namespace Resume_builder.Features.Certification.Create;

public class CreateCertificationEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGroup("certification")
            .WithTags("Certification")
            .RequireAuthorization()
            .MapPost("", async (
                CreateCertificationCommand command,
                CreateCertificationValidator validator,
                CreateCertificationHandler handler,
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
