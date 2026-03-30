using Carter;
using Resume_builder.Common;

namespace Resume_builder.Features.Certification.Update;

public class UpdateCertificationEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGroup("certification")
            .WithTags("Certification")
            .RequireAuthorization()
            .MapPut("{id}", async (
                string id,
                UpdateCertificationRequest request,
                UpdateCertificationValidator validator,
                UpdateCertificationHandler handler,
                CancellationToken cancellationToken) =>
            {
                var validationError = await validator.ValidateRequest(request);
                if (validationError != null)
                    return Results.BadRequest(validationError);

                var response = await handler.Handle(new UpdateCertificationCommand(id, request), cancellationToken);

                return response.GetResult();
            });
    }
}
