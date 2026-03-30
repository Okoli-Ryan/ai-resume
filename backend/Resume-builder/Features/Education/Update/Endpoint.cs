using Carter;
using Resume_builder.Common;

namespace Resume_builder.Features.Education.Update;

public class UpdateEducationEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGroup("education")
            .WithTags("Education")
            .RequireAuthorization()
            .MapPut("{id}", async (
                string id,
                UpdateEducationRequest request,
                UpdateEducationValidator validator,
                UpdateEducationHandler handler,
                CancellationToken cancellationToken) =>
            {
                var validationError = await validator.ValidateRequest(request);
                if (validationError != null)
                    return Results.BadRequest(validationError);

                var response = await handler.Handle(new UpdateEducationCommand(id, request), cancellationToken);

                return response.GetResult();
            });
    }
}
