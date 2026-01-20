using System.Net;
using Microsoft.EntityFrameworkCore;
using Resume_builder.Common;
using Resume_builder.Infrastructure.Repositories.ResumeRepository;
using Resume_builder.Infrastructure.Services.ClaimService;

namespace Resume_builder.Features.Resume.GetResumeInfo;

public class GetResumeInfoHandler(IResumeRepository resumeRepository, IClaimsService claimsService)
{
    public async Task<Response<ResumeInfoDto>> Handle(string resumeId, CancellationToken cancellationToken)
    {
        var userId = claimsService.GetUserId();

        if (userId is null)
            return Response<ResumeInfoDto>.Fail(HttpStatusCode.Unauthorized, "Unauthorized");

        var resume = await resumeRepository.GetResumeByUserAndResumeId(userId, resumeId, cancellationToken);

        if (resume is null)
            return Response<ResumeInfoDto>.Fail(HttpStatusCode.NotFound, "Resume not found");

        var resumeInfo = new ResumeInfoDto
        {
            Id = resume.Id,
            UserName = resume.UserName,
            ResumeName = resume.ResumeName,
            Email = resume.Email,
            Summary = resume.Summary,
            Role = resume.Role,
            Address = resume.Address,
            PhoneNumber = resume.PhoneNumber,
            Tags = resume.Tags,
            LinkedinUrl = resume.LinkedinUrl,
            GithubUrl = resume.GithubUrl,
            PortfolioUrl = resume.PortfolioUrl,
            Order = resume.Order,
            UserId = resume.UserId,
            IsFavourite = resume.IsFavourite,
            CreatedAt = resume.CreatedAt,
            UpdatedAt = resume.UpdatedAt,
            ActiveStatus = resume.ActiveStatus
        };

        return Response<ResumeInfoDto>.Success(resumeInfo);
    }
}
