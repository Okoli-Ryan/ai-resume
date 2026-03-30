using Carter;
using Resume_builder.Common;
using Resume_builder.Features.Resume.Common;

namespace Resume_builder.Features.Resume.Update;

public class UpdateResumeEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        var endpoint = app.MapGroup(ResumeConstants.ResumeMapGroupName)
            .WithTags(ResumeConstants.ResumeMapGroupTag)
            .RequireAuthorization();

        endpoint.MapPut("{resumeId}", async (
            string resumeId,
            UpdateResumeRequest request,
            UpdateResumeValidator validator,
            UpdateResumeHandler handler,
            CancellationToken cancellationToken) =>
        {
            var validationError = await validator.ValidateRequest(request);
            if (validationError != null)
                return Results.BadRequest(validationError);

            var response = await handler.Handle(new UpdateResumeCommand(resumeId, request), cancellationToken);
            return response.GetResult();
        });
    }
}