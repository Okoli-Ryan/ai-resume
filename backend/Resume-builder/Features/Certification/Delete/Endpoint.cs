using Carter;
using Resume_builder.Common;

namespace Resume_builder.Features.Certification.Delete;

public class DeleteCertificationEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGroup("certification")
            .WithTags("Certification")
            .RequireAuthorization()
            .MapDelete("{certificationId}", async (
                string certificationId,
                DeleteCertificationHandler handler,
                CancellationToken cancellationToken) =>
            {
                var response = await handler.Handle(new DeleteCertificationCommand(certificationId), cancellationToken);

                return response.GetResult();
            })
            .WithName("Delete Certification");
    }
}
