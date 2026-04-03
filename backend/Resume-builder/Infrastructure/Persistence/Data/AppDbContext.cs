using Microsoft.EntityFrameworkCore;
using Resume_builder.Common;
using Resume_builder.Features.BulletPoint;
using Resume_builder.Features.Certification;
using Resume_builder.Features.Education;
using Resume_builder.Features.Link;
using Resume_builder.Features.Project;
using Resume_builder.Features.Resume;
using Resume_builder.Features.Skills;
using Resume_builder.Features.Users;
using Resume_builder.Features.FileUpload;
using Resume_builder.Features.WorkExperience;

namespace Resume_builder.Infrastructure.Persistence.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<User> User { get; set; }
    public DbSet<ResumeEntity> Resume { get; set; }
    public DbSet<EducationEntity> Education { get; set; }
    public DbSet<ProjectEntity> Project { get; set; }
    public DbSet<BulletPointEntity> BulletPoint { get; set; }
    public DbSet<WorkExperienceEntity> WorkExperience { get; set; }
    public DbSet<SkillEntity> Skill { get; set; }
    public DbSet<LinkEntity> Link { get; set; }
    public DbSet<CertificationEntity> Certification { get; set; }
    public DbSet<FileUploadEntity> FileUpload { get; set; }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        var entries = ChangeTracker.Entries<BaseEntity>().ToList();
        var now = DateTime.UtcNow;

        foreach (var entry in entries)
            switch (entry.State)
            {
                case EntityState.Added:
                    entry.Entity.CreatedAt = now;
                    entry.Entity.UpdatedAt = now;
                    entry.Entity.ActiveStatus = true;
                    break;
                case EntityState.Modified:
                    entry.Entity.UpdatedAt = now;
                    break;
            }

        // Gather resume IDs touched by this unit of work
        var resumeIds = new HashSet<string>();

        foreach (var entry in entries)
        {
            if (entry.State is not (EntityState.Added or EntityState.Modified or EntityState.Deleted))
                continue;

            switch (entry.Entity)
            {
                case ResumeEntity resume:
                    resumeIds.Add(resume.Id);
                    break;
                case IResumeScoped scoped when !string.IsNullOrEmpty(scoped.ResumeId):
                    resumeIds.Add(scoped.ResumeId);
                    break;
            }
        }

        // Bump version on tracked resumes; defer untracked ones
        var untrackedResumeIds = new List<string>();

        foreach (var resumeId in resumeIds)
        {
            var tracked = ChangeTracker.Entries<ResumeEntity>()
                .FirstOrDefault(e => e.Entity.Id == resumeId);

            if (tracked is not null)
            {
                tracked.Entity.Version++;
                if (tracked.State == EntityState.Unchanged)
                    tracked.State = EntityState.Modified;
            }
            else
            {
                untrackedResumeIds.Add(resumeId);
            }
        }

        var result = await base.SaveChangesAsync(cancellationToken);

        // Bump version for resumes that weren't loaded in this context
        if (untrackedResumeIds.Count > 0)
            await Resume
                .Where(r => untrackedResumeIds.Contains(r.Id))
                .ExecuteUpdateAsync(s => s.SetProperty(r => r.Version, r => r.Version + 1), cancellationToken);

        return result;
    }
}