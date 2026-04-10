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

        endpoint.MapGet("minimal", async (
            string? resumeName,
            string? tags,
            DateTime? dateFrom,
            DateTime? dateTo,
            bool? isFavourite,
            GetMinimalResumesByUserIdHandler handler,
            CancellationToken cancellationToken) =>
        {
            var response = await handler.Handle(resumeName, tags, dateFrom, dateTo, isFavourite, cancellationToken);
            return response.GetResult();
        });
    }
}