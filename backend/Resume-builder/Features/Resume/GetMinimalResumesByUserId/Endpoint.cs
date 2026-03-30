using Carter;
using Resume_builder.Common;
using Resume_builder.Features.Resume.Common;

namespace Resume_builder.Features.Resume.GetMinimalResumesByUserId;

public class GetMinimalResumesByUserIdEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        var endpoint = app.MapGroup(ResumeConstants.ResumeMapGroupName)
            .WithTags(ResumeConstants.ResumeMapGroupTag)
            .RequireAuthorization();

        endpoint.MapGet("{userId}/minimal", async (
            string userId,
            GetMinimalResumesByUserIdHandler handler,
            CancellationToken cancellationToken) =>
        {
            var response = await handler.Handle(userId, cancellationToken);
            return response.GetResult();
        });
    }
}