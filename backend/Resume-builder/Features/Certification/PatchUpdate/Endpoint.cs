using Carter;
using Resume_builder.Common;

namespace Resume_builder.Features.Certification.PatchUpdate;

public class PatchUpdateCertificationEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGroup("certification")
            .WithTags("Certification")
            .RequireAuthorization()
            .MapPatch("{id}", async (
                string id,
                PatchUpdateCertificationRequest request,
                PatchUpdateCertificationValidator validator,
                PatchUpdateCertificationHandler handler,
                CancellationToken cancellationToken) =>
            {
                var validationError = await validator.ValidateRequest(request);
                if (validationError != null)
                    return Results.BadRequest(validationError);

                var response = await handler.Handle(new PatchUpdateCertificationCommand(id, request), cancellationToken);

                return response.GetResult();
            });
    }
}
