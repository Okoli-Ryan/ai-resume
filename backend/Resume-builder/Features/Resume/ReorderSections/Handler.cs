using System.Net;
using Microsoft.EntityFrameworkCore;
using Resume_builder.Common;
using Resume_builder.Features.Resume.Common;
using Resume_builder.Infrastructure.Persistence.Data;
using Resume_builder.Infrastructure.Services.ClaimService;

namespace Resume_builder.Features.Resume.ReorderSections;

public class ReorderSectionsHandler(
    AppDbContext db,
    IClaimsService claimsService) : IResponseHandler<ReorderSectionsCommand, ResumeDto>
{
    // Valid section names
    private static readonly HashSet<string> ValidSections = new()
    {
        "WorkExperience",
        "Education",
        "Skills",
        "Projects",
        "Certifications",
        "Links"
    };

    public async Task<Response<ResumeDto>> Handle(ReorderSectionsCommand command, CancellationToken cancellationToken)
    {
        var request = command.Request;
        var userId = claimsService.GetUserId();

        if (userId is null)
            return Response<ResumeDto>.Fail(HttpStatusCode.Unauthorized, "Unauthorized");

        // Validate order format
        if (string.IsNullOrWhiteSpace(request.Order))
            return Response<ResumeDto>.Fail(HttpStatusCode.BadRequest, "Order cannot be empty");

        var sections = request.Order.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
        
        // Validate all sections are valid
        var invalidSections = sections.Where(s => !ValidSections.Contains(s)).ToList();
        if (invalidSections.Any())
            return Response<ResumeDto>.Fail(HttpStatusCode.BadRequest, 
                $"Invalid section names: {string.Join(", ", invalidSections)}. Valid sections: {string.Join(", ", ValidSections)}");

        var resume = await db.Resume
            .Where(x => x.UserId == userId && x.Id == command.ResumeId)
            .FirstOrDefaultAsync(cancellationToken);

        if (resume == null)
            return Response<ResumeDto>.Fail(HttpStatusCode.NotFound, "Resume not found");

        // Update the order
        resume.Order = request.Order;

        db.Resume.Update(resume);
        await db.SaveChangesAsync(cancellationToken);

        return Response<ResumeDto>.Success(resume.ToDto());
    }
}
