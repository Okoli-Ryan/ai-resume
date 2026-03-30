using Carter;
using Resume_builder.Common;

namespace Resume_builder.Features.PdfGeneration.GeneratePdf;

public class GeneratePdfEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        var endpoint = app.MapGroup("resume")
            .WithTags("Resume PDF Generation")
            .RequireAuthorization();

        endpoint.MapGet("{resumeId}/pdf", async (
            string resumeId,
            GeneratePdfHandler handler,
            CancellationToken cancellationToken) =>
        {
            var response = await handler.Handle(new GeneratePdfCommand(resumeId), cancellationToken);

            if (!response.IsSuccess || response.Data is null)
                return response.GetResult();

            return (IResult)Results.File(response.Data.PdfBytes, "application/pdf", response.Data.Filename);
        });
    }
}