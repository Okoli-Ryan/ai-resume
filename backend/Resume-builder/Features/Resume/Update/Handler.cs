using System.Net;
using Microsoft.EntityFrameworkCore;
using Resume_builder.Common;
using Resume_builder.Features.Resume.Common;
using Resume_builder.Infrastructure.Persistence.Data;
using Resume_builder.Infrastructure.Services.ClaimService;

namespace Resume_builder.Features.Resume.Update;

public class UpdateResumeHandler(
    AppDbContext db,
    IClaimsService claimsService) : IResponseHandler<UpdateResumeCommand, ResumeDto>
{
    public async Task<Response<ResumeDto>> Handle(UpdateResumeCommand command, CancellationToken cancellationToken)
    {
        var request = command.Request;

        var userId = claimsService.GetUserId();

        if (userId is null)
            return Response<ResumeDto>.Fail(HttpStatusCode.Unauthorized, "Unauthorized");

        var resume = await db.Resume
            .Where(x => x.UserId == userId && x.Id == command.ResumeId)
            .FirstOrDefaultAsync(cancellationToken);

        if (resume == null)
            return Response<ResumeDto>.Fail(HttpStatusCode.NotFound, "Resume not found");

        resume.ResumeName = request.ResumeName;
        resume.UserFullName = request.UserName;
        resume.UserEmail = request.Email;
        resume.TextSummary = request.Summary;
        resume.Tags = request.Tags;
        resume.JobRole = request.Role;
        resume.UserAddress = request.Address;
        resume.UserPhoneNumber = request.PhoneNumber;
        resume.Order = request.Order;
        resume.LinkedinUrl = request.LinkedinUrl;
        resume.GithubUrl = request.GithubUrl;
        resume.PortfolioUrl = request.PortfolioUrl;
        resume.IsFavourite = request.IsFavourite;


        db.Resume.Update(resume);
        await db.SaveChangesAsync(cancellationToken);

        return Response<ResumeDto>.Success(resume.ToDto());
    }
}