using Carter;
using Resume_builder.Common;

namespace Resume_builder.Features.Education.PatchUpdate;

public class PatchUpdateEducationEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGroup("education")
            .WithTags("Education")
            .RequireAuthorization()
            .MapPatch("{id}", async (
                string id,
                PatchUpdateEducationRequest request,
                PatchUpdateEducationValidator validator,
                PatchUpdateEducationHandler handler,
                CancellationToken cancellationToken) =>
            {
                var validationError = await validator.ValidateRequest(request);
                if (validationError != null)
                    return Results.BadRequest(validationError);

                var response = await handler.Handle(new PatchUpdateEducationCommand(id, request), cancellationToken);

                return response.GetResult();
            });
    }
}
