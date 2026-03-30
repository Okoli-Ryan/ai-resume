using Carter;
using Resume_builder.Common;

namespace Resume_builder.Features.Education.Create;

public class CreateEducationEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGroup("education")
            .WithTags("Education")
            .RequireAuthorization()
            .MapPost("", async (
                CreateEducationCommand command,
                CreateEducationValidator validator,
                CreateEducationHandler handler,
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
