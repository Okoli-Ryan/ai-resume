using Microsoft.EntityFrameworkCore;
using Resume_builder.Common;
using Resume_builder.Features.BulletPoint;
using Resume_builder.Features.Education;
using Resume_builder.Features.Project;
using Resume_builder.Features.Resume;
using Resume_builder.Features.Skills;
using Resume_builder.Features.Users;
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

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        var entries = ChangeTracker.Entries<BaseEntity>();

        foreach (var entry in entries)
            switch (entry.State)
            {
                case EntityState.Added:
                    entry.Entity.CreatedAt = DateTime.UtcNow;
                    entry.Entity.UpdatedAt = DateTime.UtcNow;
                    entry.Entity.ActiveStatus = true;
                    break;
                case EntityState.Modified:
                    entry.Entity.UpdatedAt = DateTime.UtcNow;
                    break;
            }

        return base.SaveChangesAsync(cancellationToken);
    }
}