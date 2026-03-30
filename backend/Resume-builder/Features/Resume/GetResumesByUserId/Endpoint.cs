using Carter;
using Resume_builder.Common;
using Resume_builder.Features.Resume.Common;

namespace Resume_builder.Features.Resume.GetResumesByUserId;

public class GetResumesByUserIdEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        var endpoint = app.MapGroup(ResumeConstants.ResumeMapGroupName)
            .WithTags(ResumeConstants.ResumeMapGroupTag)
            .RequireAuthorization();

        endpoint.MapGet("user/{userId}", async (
            string userId,
            GetResumesByUserIdHandler handler,
            CancellationToken cancellationToken) =>
        {
            var response = await handler.Handle(userId, cancellationToken);
            return response.GetResult();
        });
    }
}