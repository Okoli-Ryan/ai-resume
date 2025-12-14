using System.Net;
using Resume_builder.Common;
using Resume_builder.Features.Resume.Common;
using Resume_builder.Infrastructure.Persistence.Data;
using Resume_builder.Infrastructure.Repositories.ResumeRepository;
using Resume_builder.Infrastructure.Services.ClaimService;

namespace Resume_builder.Features.Resume.GetResumeById;

public class GetResumeByIdHandler(IResumeRepository resumeRepository, IClaimsService claimsService)
{
    public async Task<Response<ResumeDto>> Handle(string resumeId, CancellationToken cancellationToken)
    {
        var userId = claimsService.GetUserId();

        if (userId is null)
            return Response<ResumeDto>.Fail(HttpStatusCode.Unauthorized, "Unauthorized");

        var resume = await resumeRepository.GetResumeByUserAndResumeId(userId, resumeId, cancellationToken);


        if (resume is null)
            return Response<ResumeDto>.Fail(HttpStatusCode.NotFound, "Resume not found");

        return Response<ResumeDto>.Success(resume.ToDto());
    }
}