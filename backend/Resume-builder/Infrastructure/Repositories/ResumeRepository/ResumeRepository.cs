using Microsoft.EntityFrameworkCore;
using Resume_builder.Features.Resume;
using Resume_builder.Infrastructure.Persistence.Data;

namespace Resume_builder.Infrastructure.Repositories.ResumeRepository;

public class ResumeRepository(AppDbContext db) : IResumeRepository
{
    public Task<ResumeEntity?> GetResumeByUserAndResumeId(string userId, string resumeId,
        CancellationToken cancellationToken = default)
    {
        return db.Resume
            .Where(x => x.UserId == userId && x.Id == resumeId)
            .AsNoTracking()
            .Include(x => x.Education)!
            .ThenInclude(x => x.BulletPoints)
            .Include(x => x.Projects)!
            .ThenInclude(x => x.BulletPoints)
            .Include(x => x.WorkExperience)!
            .ThenInclude(x => x.BulletPoints)
            .Include(x => x.Skills)
            .Include(x => x.Links)
            .FirstOrDefaultAsync(cancellationToken);
    }
}