using Carter;
using Resume_builder.Common;

namespace Resume_builder.Features.Education.Delete;

public class DeleteEducationEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGroup("education")
            .WithTags("Education")
            .RequireAuthorization()
            .MapDelete("{educationId}", async (
                string educationId,
                DeleteEducationHandler handler,
                CancellationToken cancellationToken) =>
            {
                var response = await handler.Handle(new DeleteEducationCommand(educationId), cancellationToken);

                return response.GetResult();
            })
            .WithName("Delete Education");
    }
}
