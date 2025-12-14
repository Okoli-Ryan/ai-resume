using Resume_builder.Features.Resume;

namespace Resume_builder.Infrastructure.Repositories.ResumeRepository;

public interface IResumeRepository
{
    public Task<ResumeEntity?> GetResumeByUserAndResumeId(string userId, string resumeId,
        CancellationToken cancellationToken = default);
}